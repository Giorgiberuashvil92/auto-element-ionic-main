import {Injectable} from '@angular/core';
import {FirebaseX} from "@ionic-native/firebase-x/ngx";
import {Router} from "@angular/router";
import {CoreService} from "./core.service";
import {AppCacheService} from "./storage.service";
import {Platform} from "@ionic/angular";
import {AuthService} from "./auth.service";
import {StitchService} from "./stitch.service";
import {TranslatesService} from "./translates.service";
import {first} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PushService {

    userCollection;

    constructor(
        private firebaseX: FirebaseX,
        private router: Router,
        private coreService: CoreService,
        private storageService: AppCacheService,
        private plt: Platform,
        private stitchService: StitchService,
        private authService: AuthService,
        private translatesService: TranslatesService,
    ) {
    }

    async init() {
        if (this.plt.is("cordova")) {

            this.userCollection = this.stitchService.db.collection("users");

            this.firebaseX.grantPermission();

            this.firebaseX.getToken().then(token => {
                this.saveTokenPush(token);
            });

            this.firebaseX.onTokenRefresh().subscribe(token => {
                this.saveTokenPush(token);
            });

        }
    }

    initPushReceived(){
        if (this.plt.is("cordova")) {
            this.firebaseX.onMessageReceived().subscribe(data => {
                this.newNotification(data);
            });
        }
    }

    async newNotification(data) {
        if (data.tap === 'background') {
            await this.router.navigateByUrl(data.url);
        } else {
            const buttons = [{
                text: this.translatesService.getWord('Go'),
                handler: async () => {
                    await this.router.navigateByUrl(data.url);
                }
            }];
            if (data.type == 'newAd' || data.type == 'newOffer') {
                await this.coreService.presentToast(data.title, 'danger', 5000, buttons);
            } else if (data.type == 'newMessage') {
                if (data.url !== this.router.url) {
                    await this.coreService.presentToast(data.title, 'danger', 8000, buttons);
                }
            } else {
                await this.coreService.presentToast(data.title, 'danger');
            }
        }
    }

    async saveTokenPush(token: string) {
        const query = {uid: this.authService.getLogin()};
        return await this.userCollection.updateOne(query, {$addToSet: {token}});
    }


}
