import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})
export class AppCacheService {

    constructor(private storage: Storage
    ) {
    }

    async set(key, value):Promise<any>{
        return localStorage.setItem(key, value);
    }

    async get(key):Promise<any>{
        return localStorage.getItem(key);
    }

    async getIonicStorage(key):Promise<any>{
        return this.storage.get(key);
    }

    async setIonicStorage(key, value):Promise<any>{
        return this.storage.set(key, value);
    }




}
