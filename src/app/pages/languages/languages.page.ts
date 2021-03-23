import { Component, OnInit } from '@angular/core';
import {TranslatesService} from "../../services/translates.service";
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  languages = this.translatesService.languages;

  constructor(
      private coreService: CoreService,
      private translatesService: TranslatesService,
  ) {}

  ngOnInit() {

  }

  async setLanguage(code){
    await this.translatesService.switchLang(code);
    await this.coreService.goTo('/welcome');
  }

}
