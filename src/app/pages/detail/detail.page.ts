import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {AdsService} from "../../services/ads.service";
import {ActivatedRoute} from "@angular/router";
import {AdModel} from "../../models/ad.model";
import {AuthService} from "../../services/auth.service";
import {CoreService} from "../../services/core.service";
import {ReadAdService} from "../../services/read-ad.service";
import {takeWhile} from "rxjs/operators";
import {MessagesService} from "../../services/messages.service";
import {AdvertisingService} from "../../services/advertising.service";
import {TranslatesService} from "../../services/translates.service";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

    id: string;
    ad: AdModel;
    loaded = false;
    myAd: boolean = false;
    isCopied = false;
    private alive = true;

    constructor(
        private activateRoute: ActivatedRoute,
        private authService: AuthService,
        private adService: AdsService,
        private coreService: CoreService,
        private readAdService: ReadAdService,
        private messagesService: MessagesService,
        private ngZone: NgZone,
        private translatesService: TranslatesService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    async ngOnInit() {
        this.id = this.activateRoute.snapshot.params['id'];
        this.ad = await this.adService.getByIdCache(this.id);

        if (this.ad) {
            this.checkIsMyAd(this.ad.user);
            this.loaded = true;
        }
        this.ad = await this.getDetailAd();

        this.readAdService.saveItem(this.id);

        if (this.ad)
            this.checkIsMyAd(this.ad.user);
        console.log('Ad loaded: ', this.ad);
        this.loaded = true;


    }

    async copyVIN() {
        const el = document.createElement('textarea');
        el.value = this.ad.vin;
        el.style.zIndex = '-1000';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.isCopied = true;
        setTimeout(() => this.isCopied = false, 600);
    }
     checkIsMyAd(user) {
        this.myAd = user == this.authService.getLogin();
    }

    async ionViewWillEnter() {
        await this.authService.getStitchAuth();
        this.adService.watchAd(this.id).pipe(takeWhile(() => this.alive)).subscribe((data: any) => {
            if (data.operationType == 'delete') {
                this.ngZone.run(() => {
                    this.ad = null
                });
            } else if (data.operationType == 'update') {
                this.ngZone.run(() => {
                    this.ad = data.fullDocument;
                    this.coreService.refresh()
                });
            }
            this.cdr.detectChanges();
        });
    }

    ionViewWillLeave() {
        this.alive = false;
    }

    async getDetailAd() {
        return await this.adService.getById(this.id);
    }

    async doRefresh(event) {
        this.ad = await this.getDetailAd();
        this.coreService.refresh();
        setTimeout(() => {
            event.target.complete();
        }, 200);
    }

    async setActive(active: boolean) {
        await this.adService.update(this.id, {active});
        this.ad = await this.getDetailAd();
    }

    async delete() {
        await this.coreService.presentAlert(this.translatesService.getWord('DeleteAlert'), [{
            text: this.translatesService.getWord('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
        }, {
            text: this.translatesService.getWord('Ok'),
            handler: async () => {
                await this.messagesService.setReadAd(this.id);
                await this.adService.delete(this.id);
                this.ad = await this.getDetailAd();
                await this.coreService.goRoot('/tabs/myAds',null,'back');
            }
        }]);
    }

}
