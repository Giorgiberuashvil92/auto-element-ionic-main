import {Injectable, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";
import {CoreService} from "./core.service";
import {ReplaySubject} from "rxjs";
import * as firebase from 'firebase'
import 'firebase/auth';
import {TranslatesService} from "./translates.service";
import {StitchService} from "./stitch.service";
import {first} from "rxjs/operators";
import {AppCacheService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public stateFirebase: ReplaySubject<any> = new ReplaySubject(1);
    public stateStitch: ReplaySubject<any> = new ReplaySubject(1);

    constructor(
        private fAuth: AngularFireAuth,
        private firebasePlugin: FirebaseX,
        private coreService: CoreService,
        private platform: Platform,
        private zone: NgZone,
        private translatesService: TranslatesService,
        private stitchService: StitchService,
        private storageService: AppCacheService
    ) {
        this.fAuth.auth.onAuthStateChanged(async (auth:any) => {
            if (auth != null) {

                const lang = await this.storageService.get('language');
                const role = await this.storageService.get('roleApp');
                if (!lang || lang == 'en' || !role){
                    await this.fAuth.auth.signOut();
                    await this.stitchService.logout();
                    await this.coreService.goRoot('/languages');
                }
                else {
                    console.log('UID: ', auth.uid);
                    console.log('Phone: ', auth.phoneNumber);
                    await this.stitchAuth(auth.uid, auth.phoneNumber);
                    this.zone.run(() => this.stateFirebase.next(auth));
                }
            }
        });
    }

    async stitchAuth(uid, phone){
        const auth = await this.stitchService.auth(uid, phone);
        this.zone.run(() => this.stateStitch.next(auth));
    }

    getCurrentAuth() {
        return new Promise<any>((resolve, reject) => {
            this.fAuth.auth.onAuthStateChanged(user => (user)? resolve(user) : resolve(false));
        });
    }

    async getStitchAuth(){
        await this.stitchService.checkInitedDb();
        return this.stateStitch.pipe(first()).toPromise();
    }

    getLogin(): string {
        return this.fAuth.auth.currentUser.uid;
    }

    async sendPhone(phone, captcha) {
        return new Promise(async (resolve, reject) => {
            const prefix = this.translatesService.getWord('NumberPrefix');
            const phoneNumberString = prefix + phone.replace(/\D+/g, '');
            await this.coreService.presentLoading('SendCodeNotify');
            if (!this.platform.is('cordova')) {
                await this.fAuth.auth.signInWithPhoneNumber(phoneNumberString, captcha).then(async confirmationResult => {
                    await this.coreService.dismissLoading();
                    resolve(confirmationResult.verificationId);
                }).catch(async (error) => {
                    await this.coreService.dismissLoading();
                    await this.coreService.presentAlert('ErrorSendCodeNotify');
                });
            } else {
                try {
                    const confirmationResult = await this.firebasePlugin.verifyPhoneNumber(phoneNumberString, 0);
                    await this.coreService.dismissLoading();
                    resolve(confirmationResult.verificationId ? confirmationResult.verificationId : confirmationResult);
                } catch (e) {
                    await this.coreService.dismissLoading();
                    await this.coreService.presentAlert('ErrorSendCodeNotify');
                }
            }

        });
    }

    async sendCode(confirmationResult, code) {
        const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult, code);
        await this.coreService.presentLoading('SubmitCode');
        return await this.fAuth.auth.signInWithCredential(credential).then(async (res) => {
            //await this.stitchAuth(res.user.uid, res.user.phoneNumber);
            //await this.coreService.dismissLoading();
            return true;
        }).catch(async (error) => {
            await this.coreService.dismissLoading();
            await this.coreService.presentAlert('ErrorSubmitCode');
            return false;
        });
    }

    async logout() {
        await this.fAuth.auth.signOut();
        window.location.reload();
    }

}
