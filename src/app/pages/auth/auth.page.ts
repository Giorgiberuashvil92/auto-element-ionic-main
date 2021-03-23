import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {CoreService} from '../../services/core.service';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {AppCacheService} from '../../services/storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  public check = false;

  phone = '';
  code = '';
  confirmationResult = null;
  userRole: any;

  constructor(
      private authService: AuthService,
      private coreService: CoreService,
      private cdr: ChangeDetectorRef,
      private storageService: AppCacheService
  ) { 
    
  }

   ngOnInit() {
    const user = this.storageService.get('roleApp').then(status => {
      this.userRole =  status
      console.log(this.userRole, status);
    })
  }

  phoneLength(numberLength) {
    return parseInt(numberLength);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {size: 'invisible'});
    }, 1000);
  }

  sendPhone() {
    this.authService.sendPhone(this.phone, this.recaptchaVerifier).then((confirmationResult) => {
      this.confirmationResult = confirmationResult;
      this.cdr.detectChanges();
    });
  }

  sendCode() {
    this.authService.sendCode(this.confirmationResult, this.code).then((result) => {
      this.cdr.detectChanges();
      if (result) {
        this.coreService.dismissLoading();
        return this.coreService.goRoot('/', null, 'forward');
      }
    });
  }

  cancel() {
    this.confirmationResult = null;
    this.code = '';
    this.cdr.detectChanges();
  }

}
