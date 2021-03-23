import {Component, OnInit } from '@angular/core';
import {AppCacheService} from '../../../services/storage.service';
import {AlertController } from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  roleApp;
  private logout = true;
  constructor(private storageService: AppCacheService, public alertController: AlertController, private router: Router) { }

  async ngOnInit() {
    this.roleApp = await this.storageService.get('roleApp');
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'ნამდვილად გსურთ გამოსვლა ?',
      buttons: [
        {
          text: 'არა',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancell) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'დიახ',
          handler: () => {
            this.storageService.set('Logout', true);
            this.router.navigate(['welcome']);
          }
        }
      ]
    });
    await alert.present();
  }

}
