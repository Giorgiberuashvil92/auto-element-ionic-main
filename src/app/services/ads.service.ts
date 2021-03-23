import {Injectable, NgZone} from '@angular/core';
import {StitchService} from "./stitch.service";
import {AuthService} from "./auth.service";
import {AdModel} from "../models/ad.model";

import {Observable, ReplaySubject} from "rxjs";
import {SubscriptionsService} from "./subscriptions.service";
import {first} from "rxjs/operators";
import {SellersService} from "./sellers.service";
import {SellerModel} from "../models/seller.model";
import {AppCacheService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class AdsService {

    myAdsSource$: ReplaySubject<AdModel[]> = new ReplaySubject(1);
    myAds$: Observable<AdModel[]> = this.myAdsSource$.asObservable();

    allAdsSource$: ReplaySubject<AdModel[]> = new ReplaySubject(1);
    allAds$: Observable<AdModel[]> = this.allAdsSource$.asObservable();

    adsCollection;

    constructor(
        private authService: AuthService,
        private stitchService: StitchService,
        private subscriptionsService: SubscriptionsService,
        private sellersService: SellersService,
        private storageService: AppCacheService,
        private ngZone: NgZone
    ) {
        this.init();
    }

    async init(){
        await this.stitchService.checkInitedDb();
        this.adsCollection = this.stitchService.db.collection("ads");
    }

    async add(ad: AdModel) {
        await this.authService.getStitchAuth();
        ad.dateCreate = new Date();
        ad.user = this.authService.getLogin();
        ad.active = true;
        ad.archive = false;
        ad.aliasCategory = this.subscriptionsService.transliterate(`${ad.category}_${ad.model}`);
        //await this.adsCollection.insertOne(ad);
        const result = await this.stitchService.callFunction('newAd',ad);
        this.getMyRefresh();
        return result
    }

    async delete(id: string) {
        //const query = {_id: this.stitchService.bsonObject(id)};
        //await this.adsCollection.deleteOne(query);
        await this.stitchService.callFunction('deleteAd',id);
        this.getMyRefresh();
    }

    async update(id: string, data) {
        const query = {_id: this.stitchService.bsonObject(id)};
        const update = {
            $set: data
        };
        await this.adsCollection.updateOne(query, update);
        this.getMyRefresh();
    }

    async getMyRefresh() {
        await this.authService.getStitchAuth();
        const query = {"user": this.authService.getLogin()};
        const options = {sort: {dateCreate: -1}};
        const myAds = await this.adsCollection.find(query, options).toArray();
        this.myAdsSource$.next(myAds);
        await this.storageService.setIonicStorage('myAds',JSON.stringify(myAds));
    }

    async getMyCache() {
        const myAds = JSON.parse(await this.storageService.getIonicStorage('myAds'));
        this.myAdsSource$.next(myAds);
    }

    getMy(): Observable<AdModel[]> {
        this.getMyRefresh();
        return this.myAds$;
    }

    async getById(id: string) {
        await this.authService.getStitchAuth();
        const query = {_id: this.stitchService.bsonObject(id)};
        return await this.adsCollection.findOne(query);
    }

    watchAd(ad: string){
        return this.stitchService.watch$(this.adsCollection,[this.stitchService.bsonObject(ad)]);
    }

    watchAllAds(subscriptions, seller){
        let regions:any = [{"fullDocument.region": 'AllCountry'}];
        subscriptions = subscriptions.map((subscription) => ({"fullDocument.aliasCategory":subscription.aliasCategory}));
        let query:any = {"fullDocument.archive": false};
        if (subscriptions.length){
            query.$and = [
                {$or:subscriptions},
                {operationType: 'delete'}
            ];
        }
        if (seller.region && subscriptions.length) {
            regions.push({"fullDocument.region": seller.region});
            query = {
                $or:[
                    {
                        $and: [
                            {$or: subscriptions},
                            {$or: regions},
                        ],
                        "fullDocument.archive": false,
                    },
                    {operationType: 'delete'}
                ],
            }
        }
        return this.stitchService.watch$(this.adsCollection,query);
    }

    async getInfoSellerAds(){
        let subscriptions:any = await this.subscriptionsService.get();
        let subscriptionsYears = subscriptions.map((subscription) =>  ({aliasCategory: subscription.category, min: subscription.min, max: subscription.max, state: subscription.state}));
        subscriptions = subscriptionsYears.map((subscription) => ({aliasCategory: subscription.aliasCategory}));
        const seller: SellerModel = await this.sellersService.getMy().pipe(first()).toPromise();
        return {subscriptions,seller,subscriptionsYears}
    }

    async getAllRefresh() {
        await this.authService.getStitchAuth();
        let {subscriptions,seller,subscriptionsYears} = await this.getInfoSellerAds();
        let regions:any = [{region: 'AllCountry'}];
        let query:any = {archive: false};
        if (subscriptions.length){
            query.$or = subscriptions;
        }
        if (seller.region && subscriptions.length) {
            regions.push({region: seller.region});
            query = {
                $and: [
                    {$or: subscriptions},
                    {$or: regions},
                ],
                archive: false,
            }
        }
        const options = {sort: {dateCreate: -1}};
        let allAds = [];
        if (subscriptions.length) {
            allAds = await this.adsCollection.find(query, options).toArray();
        }
        this.ngZone.run(()=>{

            allAds = allAds.filter((ad: AdModel)=>{
                const sub = subscriptionsYears.find(x => x.aliasCategory === ad.aliasCategory);
                const min = sub.min ? sub.min : new Date().getFullYear() - 100;
                const max = sub.max ? sub.max : new Date().getFullYear();
                return max >= ad.year && min <= ad.year
            });

            allAds = allAds.filter((ad: AdModel)=>{
                const sub = subscriptionsYears.find(isState);
                function isState(element) {
                    if (!element.state) return true;
                    return element.state == 'Any' || element.state == ad.state || ad.state == 'Any'
                }
                return !!sub;
            });

            this.allAdsSource$.next(allAds);
        });
        await this.storageService.setIonicStorage('allAds',JSON.stringify(allAds));
    }

    async getAllCache() {
        const allAds = JSON.parse(await this.storageService.getIonicStorage('allAds'));
        this.allAdsSource$.next(allAds);
    }

    getAll(): Observable<AdModel[]> {
        this.getAllRefresh();
        return this.allAds$;
    }

    async getByIdCache(id:string) {
        let ads:AdModel[] = JSON.parse(await this.storageService.getIonicStorage('allAds'));
        if (!ads || !ads.length) {
            ads = JSON.parse(await this.storageService.getIonicStorage('myAds'));
        }
        if (ads && ads.length) {
            return ads.find((ad) => ad._id.toString() == id);
        }
    }

}
