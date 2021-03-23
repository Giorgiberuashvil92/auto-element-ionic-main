import {ChangeDetectorRef, Component, Pipe, PipeTransform} from '@angular/core';
import {AdsService} from "../../../services/ads.service";
import {AdModel} from "../../../models/ad.model";
import {ReadAdService} from "../../../services/read-ad.service";
import {Observable} from "rxjs";
import {MessageModel} from "../../../models/message.model";
import {MessagesService} from "../../../services/messages.service";
import {OffersService} from "../../../services/offers.service";
import {OfferModel} from "../../../models/offer.model";
import {takeWhile} from "rxjs/operators";
import {SellerModel} from "../../../models/seller.model";
import {CoreService} from "../../../services/core.service";


@Pipe({
    name: 'sortUnread',
})
export class UnreadPipe implements PipeTransform {

    transform(value: Array<AdModel>, unread: any) {

        if (value && unread.length) {
            value.forEach((ad)=>{
                ad.cnt = unread.filter(((item) => {return item['ad'] == ad._id.toString()})).length;
            });
            return value.sort(this.compare);
        }
        else {
            return value;
        }
    }

    compare(a: AdModel, b: AdModel) {
        const aDate = new Date(a.dateCreate).getTime();
        const bDate = new Date(b.dateCreate).getTime();
        if(a.cnt == b.cnt)
        {
            return (aDate < bDate) ? 1 : (aDate > bDate) ? -1 : 0;
        }
        if (a.cnt > b.cnt) {
            return -1;
        } else if (a.cnt < b.cnt) {
            return 1;
        }
        return 0;
    }

}

@Component({
    selector: 'app-all-ads',
    templateUrl: './all-ads.page.html',
    styleUrls: ['./all-ads.page.scss'],
})
export class AllAdsPage {

    private alive = true;

    allAds: any;

    subscriptions: Array<string>;
    seller: SellerModel;
    rating = -1;
    unread = [];

    trackByFn(index: number, item: AdModel) {
        return item._id.toString();
    }

    itemHeightFn(item, index) {
        return 109;
    }

    constructor(
        private adsService: AdsService,
        private readAdService: ReadAdService,
        private messagesService: MessagesService,
        private offersService: OffersService,
        private coreService: CoreService,
        private cdr: ChangeDetectorRef
    ) {
    }

    checkRead(_id:string){
        return this.readAdService.getItem(_id);
    }

    ngOnInit(){
        this.offersService.getOffersBySellerInit();
        this.coreService.currentRoute.subscribe((route)=>{
            if (route == '/tabs/allAds'){
                this.init();
            }
        });
    }

    ionViewDidEnter() {
    }

    init(){
        this.getAllAds();
        this.alive = true;
        this.watch();
        this.adsService.getAllCache();
    }

    ionViewWillLeave() {
        this.alive = false;
    }

    colorRating (rating){
        if (rating < 35){
            return 'danger';
        } else if (rating <= 69){
            return 'warning'
        } else if (rating >= 70){
            return 'success'
        } else return 'danger';
    }

    getAllAds() {
        this.allAds = this.adsService.getAll();
        this.messagesService._unreadMessages.pipe(takeWhile(() => this.alive)).subscribe((unread)=>{
            this.unread = unread;
        });
    }

    async watch(){
        const userInfo = await this.adsService.getInfoSellerAds();
        this.subscriptions = userInfo.subscriptions;
        this.seller = userInfo.seller;
        this.rating = this.seller.rating ? this.seller.rating : 0;
        console.log(this.rating);
        this.adsService.watchAllAds(this.subscriptions, this.seller).pipe(takeWhile(() => this.alive)).subscribe((a)=>{
            this.getAllAds();
            this.cdr.detectChanges();
        });
    }

    async doRefresh(event) {
        await this.getAllAds();
        setTimeout(() => {
            event.target.complete();
        }, 200);
    }

    getUnread(collection, id):Observable<MessageModel[]>{
        return this.messagesService.getUnreadItem(collection, id);
    }

    getOffer(id):Observable<OfferModel>{
        return this.offersService.getOfferItemByAd(id);
    }

}
