import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {NavigationEnd, Router} from "@angular/router";

import {TranslatesService} from "./services/translates.service";
import {StitchService} from "./services/stitch.service";
import {SubscriptionsService} from "./services/subscriptions.service";
import {PushService} from "./services/push.service";
import {AuthService} from "./services/auth.service";
import {MessagesService} from "./services/messages.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    currentURL: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private translatesService: TranslatesService,
        private stitchService: StitchService,
        private pushService: PushService,
        private authService: AuthService,
        private subscriptionsService: SubscriptionsService,
        private messagesService: MessagesService
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready();

        if (this.platform.is('android')) {
            this.statusBar.styleLightContent();
            this.initMinimizeAndroid();
        } else {
            this.statusBar.styleDefault();
        }

        await this.initServices();
    }

    initMinimizeAndroid() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentURL = this.router.url;
            }
        });

        this.platform.backButton.subscribe(() => {
            const listFirstURL = [
                '/tabs',
                '/tabs/allAds',
                '/tabs/myAds',
                '/tabs/sellers',
                '/tabs/settings',
                '/languages',
            ];


            if (listFirstURL.indexOf(this.currentURL) >= 0) {
                navigator['app'].exitApp();
            }
        });
    }

    async initServices() {
        await this.translatesService.init();
        await this.stitchService.init();
        this.pushService.initPushReceived();
        await this.authService.getCurrentAuth().then(()=>{
            this.splashScreen.hide();
        });
        await this.initAuthServices();
    }

    initAuthServices(){
        return this.authService.getStitchAuth().then(async ()=>{
            await this.pushService.init();
            await this.subscriptionsService.init();
            await this.messagesService.init();
        });
    }

}
