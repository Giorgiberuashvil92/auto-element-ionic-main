import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

import * as firebase from 'firebase';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/uploads';
  private baseFolder = `${this.basePath}/${this.authService.getLogin()}`;

  completed$ = new Subject<any>();

  constructor(
      private authService: AuthService,
  ) { }

  pushFileToStorage(fileUpload){
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.baseFolder}/image_${Date.now()}`).put(fileUpload);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: UploadTaskSnapshot) => {},
        (err) => {
          console.log(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.completed$.next(downloadURL);
          });
        });
  }

}