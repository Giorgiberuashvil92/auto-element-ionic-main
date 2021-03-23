import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {AppCacheService} from "./storage.service";
import {first} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class AdvertisingService {

    constructor(
        private afd: AngularFireDatabase,
        private storageService: AppCacheService
    ) {
    }

    async getRandom(){
        const lang = await this.storageService.get('language');
        const res = await this.afd.list('/advertising',ref => ref.orderByChild('lang').equalTo(lang)).snapshotChanges().pipe(first()).toPromise();
        const data = res.map((item)=>{
                return {id:item.key, ...item.payload.val()}
        });
        return data[Math.floor(Math.random()*data.length)];
    }

}