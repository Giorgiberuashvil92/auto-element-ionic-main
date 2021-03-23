import {Component, OnInit, ViewChild} from '@angular/core';
import {Stitch, AnonymousCredential} from 'mongodb-stitch-browser-sdk';
import {CoreService} from '../core.service';
import {IonDatetime} from '@ionic/angular';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-delete-user',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

    uid = '';
    region = '';
    langs = ['az', 'ka', 'kk', 'ru', 'uk', 'uz'];

    stitch;
    client;

    userId;
    userInfo;
    subs;

    objectKeys = Object.keys;

    @ViewChild('datetime', {static: false}) datetime: IonDatetime;


    constructor(private coreService: CoreService) {
    }

    async ngOnInit() {
        await this.init();
        this.client.auth.loginWithCredential(new AnonymousCredential()).then((user) => {
            console.log(`Logged in as anonymous user with id: ${user.id}`);
        });
    }

    async callFunction(name, data, args = {}) {
        return await this.client.callFunction(name, [data, args]);
    }

    async init(): Promise<boolean> {
        this.stitch = Stitch;
        this.client = this.stitch.initializeDefaultAppClient('autoelement-blqls');
        return true;
    };

    findUser() {
        this.userId = this.uid;
        this.callFunction('findUser', [this.userId, this.region, 'find']).then((res) => {
            if (res.user) {
                this.userInfo = res.user;
                if (res.seller) {
                    this.subs = res.seller.subscriptions;
                } else {
                  this.subs = null;
                }
                console.log(this.subs);
            } else {
                this.userId = null;
                this.userInfo = null;
                this.subs = null;
                this.coreService.presentToast('Пользователь не найден', 'danger');
            }
        });
    }

    async deleteVip(category) {
        return await this.callFunction('findUser', [this.userId, this.region, 'deleteVip', category]);
    }

    async setVip(category, dateEnd) {
        return await this.callFunction('findUser', [this.userId, this.region, 'setVip', category, dateEnd]);
    }


    async changeVip(event, subscription, i) {
        if (event.target.checked) {
            await this.deleteVip(subscription);
            this.subs[i].vip = false;
            this.subs[i].dateEnd = null;
        } else {
            event.target.checked = !event.target.checked;
            this.datetime.min = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
            this.datetime.max = new Date(new Date().setDate(new Date().getFullYear() + 10)).toISOString();
            await this.datetime.open();
            this.datetime.ionChange.pipe(first()).subscribe((ev:any) => {
                if (ev.target.value) {
                    event.target.checked = !event.target.checked;
                    this.setVip(subscription, ev.target.value);
                    this.subs[i].vip = true;
                    this.subs[i].dateEnd = ev.target.value;
                    this.datetime.value = null;
                }
            });
        }
    }

    async deleteUser() {
        this.callFunction('deleteUser', [this.userId, this.region]).then(() => {
            this.coreService.presentToast('Успешно удалено', 'success');
            this.uid = '';
        });
    }

}
