import {Injectable, NgZone} from '@angular/core';
import {AuthService} from './auth.service';
import {StitchService} from './stitch.service';
import {MessageModel} from '../models/message.model';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/internal/operators/map';
import {first} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {

    messagesCollection;

    public _unreadMessages: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);

    inited: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        private authService: AuthService,
        private stitchService: StitchService,
        private ngZone: NgZone
    ) {
    }


    async init() {
        await this.stitchService.checkInitedDb();
        this.messagesCollection = this.stitchService.db.collection('messages');
        this.inited.next(true);
        this.getUnreadInit();
    }

    async getCollection() {
        await this.inited.pipe(first()).toPromise();
        return await this.messagesCollection;
    }

    async getUnreadInit() {
        this.getUnread();
        const pipeline = {'fullDocument.to': this.authService.getLogin(), 'fullDocument.isRead': false};
        this.stitchService.watch$(await this.getCollection(), pipeline).subscribe((data: any) => {
            const newMessage: MessageModel = data.fullDocument;
            if (data.operationType == 'insert') {
                this.ngZone.run(() => {
                    this._unreadMessages.next([...this._unreadMessages.getValue(), newMessage]);
                });
            }
        });
    }

    getUnreadItem(collection, id) {
        return this._unreadMessages.pipe(map((items) => {
            return items.filter(((item) => {
                return item[collection] == id;
            }));
        }));
    }

    async getUnread() {
        const query = {to: this.authService.getLogin(), isRead: false};
        this._unreadMessages.next(await (await this.getCollection()).find(query).toArray());
    }

    async setReadOffer(offer, message?: MessageModel) {
        await this.authService.getStitchAuth();
        const query: any = {offer, to: this.authService.getLogin()};
        if (message) {
            query._id = message._id;
        }
        const update = {$set: {isRead: true}};
        await (await this.getCollection()).updateMany(query, update);
        this.getUnread();
    }

    async setReadAd(ad: string) {
        await this.authService.getStitchAuth();
        const query: any = {ad, to: this.authService.getLogin()};
        const update = {$set: {isRead: true}};
        await (await this.getCollection()).updateMany(query, update);
        this.getUnread();
    }

    async add(message: MessageModel, push: boolean = true) {
        message.dateCreate = new Date();
        message.from = this.authService.getLogin();
        message.isRead = false;
        //await this.offersCollection.insertOne(offer);
        return await this.stitchService.callFunction('newMessage', message, {push});
    }

    async getMessages(offer: string) {
        await this.authService.getStitchAuth();
        const query = {offer: offer};
        return await (await this.getCollection()).find(query).toArray();
    }

    watch(offer) {
        const pipeline = {'fullDocument.offer': offer};
        return this.stitchService.watch$(this.messagesCollection, pipeline);
    }

}
