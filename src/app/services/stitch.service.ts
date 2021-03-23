import {Injectable} from '@angular/core';
import {Stitch, RemoteMongoClient, FunctionCredential, BSON} from 'mongodb-stitch-browser-sdk';
import {AppCacheService} from "./storage.service";
import {from, Observable, ReplaySubject} from "rxjs";
import {first, switchMap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class StitchService {

    stitch;
    client;
    db;

    initedDb: ReplaySubject<string> = new ReplaySubject<string>(1);

    constructor(private storageService: AppCacheService) {}


    async callFunction(name, data, args = {}){
        const language:string = await this.storageService.get('language');
        return await this.client.callFunction(name, [language,data,args]);
    }

    async init(): Promise<boolean> {
        this.stitch = Stitch;
        this.client = this.stitch.initializeDefaultAppClient('autoelement-blqls');
        return true;
    };

    async initDb():Promise<string>{
        const language:string = await this.storageService.get('language');
        this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'Autoelement').db(language);
        this.initedDb.next(language);
        return language;
    }

    async checkInitedDb(){
        return await this.initedDb.pipe(first()).toPromise();
    }

    async auth(uid, phone){
      const language:string = await this.initDb();
      const role = await this.storageService.get('roleApp');
      const credential = new FunctionCredential({uid, phone, role, language});
      return await this.client.auth.loginWithCredential(credential);
    }

    async logout(){
        return await this.client.auth.logout();
    }

    bsonObject(id){
        return new BSON.ObjectId(id);
    }

    watch$(collection,pipeline:any = []) {
        return from(collection.watch(pipeline))
            .pipe(
                switchMap((stream:any) => {
                    return new Observable((subscriber) => {
                        stream.onNext((event) => {
                            subscriber.next(event);
                        });
                    });
                })
            );
    }

}
