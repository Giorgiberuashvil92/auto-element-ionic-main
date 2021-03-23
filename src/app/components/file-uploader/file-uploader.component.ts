import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadService} from "../../services/upload.service";

@Component({
  selector: 'file-uploader',
  inputs: ['width','height','color'],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {

  @Input()
  file;
  width;
  height;
  color;

  @Output()
  fileUploaded = new EventEmitter();

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    if (this.file) {
      this.uploadService.pushFileToStorage(this.file);
      this.uploadService.completed$.subscribe((upload) => {
        this.fileUploaded.emit(upload);
      });
    }
  }

}
