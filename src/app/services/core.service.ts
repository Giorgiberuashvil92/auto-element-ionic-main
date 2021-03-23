import {Injectable} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, ToastController} from "@ionic/angular";
import {TranslatesService} from "./translates.service";
import {Observable, ReplaySubject, Subject, Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CoreService {

    public currentRoute: ReplaySubject<any> = new ReplaySubject(1);

    dataRefresh = new Subject<string>();

    private enabledBackButton = true;
    private backButtonSub: Subscription;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private alertController: AlertController,
        private toastController: ToastController,
        private loadingController: LoadingController,
        private translatesService: TranslatesService,
        private router: Router
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentRoute.next(this.router.url);
            }
        });
    }

    refresh() {
        this.dataRefresh.next();
    }

    onResume(): Observable<any>{
        return this.platform.resume
    }

    onPause(): Observable<any>{
        return this.platform.pause
    }

    public goTo(url: string, id?: any) {
        let path = [url];
        id ? path.push(id) : null;
        return this.navCtrl.navigateForward(path);
    }

    public goRoot(url: string, id?: any, animation?:'back'|'forward') {
        const options = {animationDirection:animation?animation:undefined};
        let path = [url];
        id ? path.push(id) : null;
        return this.navCtrl.navigateRoot(path,options);
    }

    async presentAlert(message: string, buttons:any = ['OK']) {
        const alert = await this.alertController.create({
            message: this.translatesService.getWord(message),
            buttons: buttons
        });
        await alert.present();
    }

    async presentToast(message: string, color?: string, duration = 3000, buttons?:any) {
        const getTop = await this.toastController.getTop();
        if (getTop) await this.toastController.dismiss();

        color = color ? color : 'primary';
        const toast = await this.toastController.create({
            color,
            message: this.translatesService.getWord(message),
            duration,
            position: 'bottom',
            buttons
        });
        await toast.present();
    }

    async presentLoading(message: string) {
        this.disableBackBtn();
        const loading = await this.loadingController.create({
            message: this.translatesService.getWord(message),
        });
        return await loading.present();
    }

    async dismissLoading() {
        this.enableBackBtn();
        return await this.loadingController.dismiss();
    }

    disableBackBtn() {
        this.enabledBackButton = false;
        this.startBackButtonSub();
        document.addEventListener('backbutton', (() => {
        }), false);
    }

    enableBackBtn() {
        this.enabledBackButton = true;
        this.stopBackButtonSub();
        document.removeEventListener('backbutton', () => {
        }, false);
    }

    startBackButtonSub() {
        this.backButtonSub = this.platform.backButton.subscribeWithPriority(9999, () => {});
    }

    stopBackButtonSub() {
        this.backButtonSub.unsubscribe();
    }

    loadScripts(scripts: Array<string>) {
        for (let i = 0; i < scripts.length; i++) {
            const node = document.createElement('script');
            node.src = scripts[i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            node.id = scripts[i];
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }

    deleteScripts(scripts: Array<string>) {
        for (let i = 0; i < scripts.length; i++) {
            document.getElementById(scripts[i]).remove();
        }
    }

}
