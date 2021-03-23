import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { UploadService } from './upload.service';

@Component({
  selector: 'photoUpload',
  templateUrl: './photoUpload.component.html',
  styleUrls: ['./photoUpload.component.scss'],
})
export class PhotoUploadComponent implements OnInit {

  @Input() readOnly;

  @Input() src;

  @Output() srcChange = new EventEmitter();

  @ViewChild('fileUploadWeb', {static: false}) fileUploadWeb: ElementRef<HTMLInputElement>;

  load = false;
  loadSrc;

  constructor(
    private platform: Platform,
    private DomSanitizationService: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {}


  async actionSheetChoiceFile() {
      this.fileUploadWeb.nativeElement.click();
  }

  async returnFile(file) {
    if (file) {
      this.load = true;
      this.loadSrc = this.DomSanitizationService.bypassSecurityTrustUrl(URL.createObjectURL(file));
      const upload = await this.uploadService.pushFileToStorage(file);
      this.srcChange.emit(upload);
      setTimeout(() => {
        this.load = false;
        this.loadSrc = null;
      }, 1000);
      this.cdr.detectChanges();
    }
  }

}
