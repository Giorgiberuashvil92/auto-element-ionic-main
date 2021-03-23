import { Injectable } from '@angular/core';
import {AngularFireStorage} from "@angular/fire/storage";

import * as firebase from 'firebase';
import 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/advertising';

  constructor(
      private storage: AngularFireStorage
  ) { }

  async pushFileToStorage(fileUpload) {
    return new Promise((resolve, reject) => {
      const storageRef = this.storage.ref(`${this.basePath}`);
      const uploadTask = storageRef.child(`file_${Date.now()}`).put(fileUpload);

      uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
        },
        (err) => {
          console.log(err);
        },
        () => {
          uploadTask.then(async (task)=>{
            resolve(await task.ref.getDownloadURL());
          });
        });
    });
  }

}
