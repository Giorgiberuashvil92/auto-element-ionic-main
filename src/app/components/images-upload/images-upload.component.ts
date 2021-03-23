import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {ActionSheetController, ModalController} from "@ionic/angular";

import {UploadService} from '../../services/upload.service';
import {ImageModalViewComponent} from "../image-modal-view/image-modal-view.component";
import {TranslatesService} from "../../services/translates.service";

@Component({
  selector: 'app-images-upload',
  inputs:['count','images','readOnly'],
  outputs:['images'],
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
})
export class ImagesUploadComponent implements OnInit, OnDestroy {

  files: Array<string> = [];

  selectedFile;

  @Input() count: number;
  @Input() readOnly = false;

  get images() {
    return this.files;
  }

  set images(value: Array<string>) {
      this.files = value;
      this.imagesChange.emit(this.files);
      this.checkCount();
  }

  @Output() imagesChange = new EventEmitter();

  allow: boolean = false;

  constructor(
      private uploadService: UploadService,
      public modalController : ModalController,
      private cdr: ChangeDetectorRef,
      public actionSheetController: ActionSheetController,
      private translatesService: TranslatesService
  ) {
  }

  ngOnInit() {
    if (!this.files) this.files = [];
    this.checkCount()
  }

  ngOnDestroy(){
    this.cdr.detach();
  }

  checkCount() {
    this.allow = this.files ? this.files.length < this.count:true;
    this.cdr.detectChanges();
  }

  async openPreview(img) {
    const modal = await this.modalController.create({
      component: ImageModalViewComponent,
      componentProps: {img: img}
    });
    await modal.present();
  }

  async actionSheetChoiceAction(file) {
    if (this.readOnly){
      return this.openPreview(file);
    }
    const actionSheet = await this.actionSheetController.create({
      header: this.translatesService.getWord('Action'),
      buttons: [
        {
          text: this.translatesService.getWord('FullScreen'),
          icon: 'open',
          handler: () => {
            this.openPreview(file);
          }
        },
        {
          text: this.translatesService.getWord('Delete'),
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.files.splice(this.files.indexOf(file), 1);
            this.checkCount();
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
  }

  onFileSelect(file){
    this.selectedFile = file;
    this.cdr.detectChanges();
  }

  onFileUploaded(upload){
    this.selectedFile = null;
    this.images = this.files.concat(upload);
    this.checkCount();
  }

}
