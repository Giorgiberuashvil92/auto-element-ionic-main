import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessagesService} from '../../services/messages.service';
import {MessageModel} from '../../models/message.model';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject} from 'rxjs';
import {first, takeWhile} from 'rxjs/operators';
import {CoreService} from '../../services/core.service';
import {OfferModel} from '../../models/offer.model';
import {SellersService} from '../../services/sellers.service';
import {ActionSheetController, LoadingController, ModalController, Platform} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {TranslatesService} from '../../services/translates.service';
import {UploadService} from '../../services/upload.service';
import {ImageModalViewComponent} from '../../components/image-modal-view/image-modal-view.component';
import {AppCacheService} from '../../services/cache.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.page.html',
    styleUrls: ['./messages.page.scss'],
})
export class MessagesPage {

    @ViewChild('content', {static: false}) content: any;

    loaded = false;
    paused = false;

    private alive = true;

    adId: string;
    offerId: string;
    to: string;

    text = '';

    myUid: string;

    userName: '';

    messages: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);

    @ViewChild('fileUploadWeb', {static: false}) fileUploadWeb: ElementRef<HTMLInputElement>;

    options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true
    };

    optionsBackground = {
        id: -1,
        title: this.translatesService.getWord('Load'),
        text: this.translatesService.getWord('WaitImage'),
        hidden: false,
        silent: false,
        sticky: true,
        resume: false,
        foreground: true,
    };

    trackByFn(index: number, item: MessageModel) {
        return item._id.toString();
    }

    constructor(
        private activateRoute: ActivatedRoute,
        private messagesService: MessagesService,
        private authService: AuthService,
        private coreService: CoreService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private sellersService: SellersService,
        private platform: Platform,
        private camera: Camera,
        private file: File,
        private backgroundMode: BackgroundMode,
        public actionSheetController: ActionSheetController,
        private translatesService: TranslatesService,
        private uploadService: UploadService,
        private modalController: ModalController,
        private loadingController: LoadingController,
        private cacheService: AppCacheService
    ) {
    }

    ionViewWillEnter() {
        this.adId = this.activateRoute.snapshot.params.ad;
        this.offerId = this.activateRoute.snapshot.params.offer;
        this.to = this.activateRoute.snapshot.params.to;
        this.myUid = this.authService.getLogin();
        this.initMessages();
        this.onResume();
        this.onPause();
    }

    ionViewWillLeave() {
        this.alive = false;
    }

    async initMessages() {

        this.sellersService.getByUid(this.to).then((seller) => {
            this.userName = seller.name ? seller.name : '';
        });

        this.messages.next(await this.messagesService.getMessages(this.offerId));
        this.loaded = true;
        this.scrollNewMessage();
        await this.messagesService.setReadOffer(this.offerId);
        this.messagesService.watch(this.offerId).pipe(takeWhile(() => this.alive)).subscribe((data: any) => {
            const newMessage: MessageModel = data.fullDocument;
            this.ngZone.run(() => {
                if (data.operationType == 'insert') {
                    this.messages.next([...this.messages.getValue(), newMessage]);
                    if (newMessage.to == this.myUid && !this.paused) {
                        this.messagesService.setReadOffer(this.offerId, newMessage);
                    }
                } else if (data.operationType == 'update') {
                    const refreshMessages = this.messages.getValue().map((message) => {
                        return message._id.toString() == newMessage._id.toString() ? newMessage : message;
                    });
                    this.messages.next(refreshMessages);
                }
            });
            this.cdr.detectChanges();
            this.scrollNewMessage();
        });
    }

    onResume() {
        this.coreService.onResume().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.paused = false;
            this.messagesService.setReadOffer(this.offerId);
        });
    }

    onPause() {
        this.coreService.onPause().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.paused = true;
        });
    }

    scrollNewMessage() {
        this.content.scrollToPoint(0, 50000, 500);
    }

    async send(text, img) {
        const message: MessageModel = new MessageModel();
        message.ad = this.adId;
        message.to = this.to;
        message.offer = this.offerId;
        message.text = text;
        message.img = img;
        this.text = '';
        await this.messagesService.add(message);
    }

    async actionSheetChoiceFile() {
        if (this.platform.is('cordova')) {
            const actionSheet = await this.actionSheetController.create({
                header: this.translatesService.getWord('PhotoSource'),
                buttons: [
                    {
                        text: this.translatesService.getWord('Camera'),
                        icon: 'camera',
                        handler: () => {
                            this.selectImage(this.camera.PictureSourceType.CAMERA);
                        }
                    },
                    {
                        text: this.translatesService.getWord('Album'),
                        icon: 'image',
                        handler: () => {
                            this.selectImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                        }
                    },
                    {
                        text: this.translatesService.getWord('Cancel'),
                        icon: 'close',
                        role: 'cancel',
                    }
                ]
            });
            await actionSheet.present();
        } else {
            this.fileUploadWeb.nativeElement.click();
        }
    }

    async selectImage(source: number) {
        this.backgroundMode.setDefaults(this.optionsBackground);
        this.backgroundMode.enable();
        this.options.sourceType = source;
        this.options.allowEdit = (source === this.camera.PictureSourceType.PHOTOLIBRARY);
        this.camera.getPicture(this.options)
            .then(async (camera) => {
                const file: any = await this.makeFileIntoBlob(camera);
                this.returnFile(file.imgBlob);
                setTimeout(() => {
                    this.backgroundMode.disable();
                }, 2000);
            }).catch(() => {
            setTimeout(() => {
                this.backgroundMode.disable();
            }, 2000);
        });
    }


    makeFileIntoBlob(_imagePath) {
        return new Promise((resolve, reject) => {
            let fileName = '';
            this.file.resolveLocalFilesystemUrl(_imagePath)
                .then(fileEntry => {
                    const {name, nativeURL} = fileEntry;
                    const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
                    fileName = name;
                    return this.file.readAsArrayBuffer(path, name);
                })
                .then(buffer => {
                    const imgBlob = new Blob([buffer], {type: 'image/jpeg'});
                    resolve({fileName, imgBlob});
                })
                .catch(e => reject(e));
        });
    }

    async returnFile(file) {
        await this.presentLoading();
        this.uploadService.pushFileToStorage(file);
        this.uploadService.completed$.pipe(first()).subscribe((upload) => {
            this.send(upload, true);
            this.loadingController.dismiss();
        });
    }

    async presentLoading() {
        let sub;
        const loading = await this.loadingController.create({
            message: this.translatesService.getWord('Load'),
            translucent: true,
            backdropDismiss: false
        });
        loading.present().then(() => {
            sub = this.platform.backButton.subscribeWithPriority(1, () => {});
        });
        loading.onDidDismiss().then(() => {
            sub.unsubscribe();
        });
    }

    async openPreview(img) {
        const modal = await this.modalController.create({
            component: ImageModalViewComponent,
            componentProps: {img}
        });
        await modal.present();
    }

    callPhone() {
        window.location.href = `tel:+${this.activateRoute.snapshot.queryParams.phone}`;
    }
}
