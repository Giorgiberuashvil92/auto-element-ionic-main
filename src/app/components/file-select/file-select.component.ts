import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera/ngx";
import {File} from "@ionic-native/file/ngx";
import {BackgroundMode} from "@ionic-native/background-mode/ngx";
import {ActionSheetController, Platform} from "@ionic/angular";
import {TranslatesService} from "../../services/translates.service";

@Component({
  selector: 'file-select',
  inputs: ['width','height','color','name'],
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss'],
})
export class FileSelectComponent implements OnInit {

  @Input()
  width;
  height;
  name = 'cloud-upload';
  color;

  @Output() selectedFile = new EventEmitter();

  @ViewChild('fileUploadWeb',{static:false}) fileUploadWeb: ElementRef<HTMLInputElement>;

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

  constructor(
      private platform: Platform,
      private camera: Camera,
      private file: File,
      private backgroundMode: BackgroundMode,
      public actionSheetController: ActionSheetController,
      private translatesService: TranslatesService
  ) { }

  ngOnInit() {}

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
          .then(async (camera)=>{
            const file:any = await this.makeFileIntoBlob(camera);
            this.returnFile(file.imgBlob);
            setTimeout(()=>{this.backgroundMode.disable()},2000);
          }).catch(()=>{
        setTimeout(()=>{this.backgroundMode.disable()},2000);
      });
    }


  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file.resolveLocalFilesystemUrl(_imagePath)
          .then(fileEntry => {
            let {name, nativeURL} = fileEntry;
            let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
            fileName = name;
            return this.file.readAsArrayBuffer(path, name);
          })
          .then(buffer => {
            let imgBlob = new Blob([buffer], {type: "image/jpeg"});
            resolve({fileName, imgBlob});
          })
          .catch(e => reject(e));
    });
  }

  returnFile(file){
    this.selectedFile.emit(file);
  }


}
