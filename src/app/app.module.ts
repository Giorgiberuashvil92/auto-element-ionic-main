import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {FirebaseModule} from './firebase.module';
import {CacheModule} from 'ionic-cache';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            backButtonText: ''
        }),
        IonicStorageModule.forRoot({
            name: 'AUTOELEMENT',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        FirebaseModule,
        CacheModule.forRoot()
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        File,
        BackgroundMode,
        FirebaseModule,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
