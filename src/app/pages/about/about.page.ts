import { Component, OnInit } from '@angular/core';

import {AppCacheService} from "../../services/storage.service";

import * as base from '../../../assets/about.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  text;

  private about = base['default'];

  constructor(private storageService: AppCacheService) { }

  async ngOnInit(){
      const lang = await this.storageService.get('language');
      this.text = this.about[lang];
  }

}
