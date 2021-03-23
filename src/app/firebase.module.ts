import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {AngularFireDatabaseModule} from "@angular/fire/database";
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';

const firebaseConfig = {
  apiKey: "AIzaSyC-J2Fv3LPvV0wb_tQOmxfbNU4lhPsQ5gM",
  authDomain: "autoelement-9c85b.firebaseapp.com",
  databaseURL: "https://autoelement-9c85b.firebaseio.com",
  projectId: "autoelement-9c85b",
  storageBucket: "autoelement-9c85b.appspot.com",
  messagingSenderId: "100730968138",
  appId: "1:100730968138:web:840170bd7a1a84d67baeb3",
  measurementId: "G-450L01ZXZN"
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule
  ],
  exports: [],
  providers: [FirebaseX]
})
export class FirebaseModule {
}
