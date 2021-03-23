import { Component, OnInit } from '@angular/core';
import {CoreService} from '../../services/core.service';
import {AppCacheService} from '../../services/storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

    isInfo: boolean;
    
  constructor(
      private coreService: CoreService,
      private storageService: AppCacheService
  ) { }

  ngOnInit() {
  }
  
  async setRole(role) {
      await this.storageService.set('roleApp', role);
      await this.coreService.goTo('/auth');
  }

 async getLogOutInfo() {
    this.isInfo = await this.storageService.get('Logout');
    console.log(this.isInfo);
  }

}
