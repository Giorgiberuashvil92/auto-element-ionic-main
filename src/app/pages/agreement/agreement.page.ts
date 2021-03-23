import { Component, OnInit } from '@angular/core';

import * as base from '../../../assets/agreement.json';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {

  text;

  private agreement = base['default'];

  constructor() { }

  async ngOnInit(){
    this.text = this.agreement['agreement'];
  }
}
