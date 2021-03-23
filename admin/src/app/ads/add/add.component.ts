import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  @Input() lang;

  link = '';
  photo = '';
  constructor(
      private modalController: ModalController,
      private afd: AngularFireDatabase
  ) { }

  ngOnInit() {}

  async save(){
    await this.afd.list(`advertising`).push({link:this.link,photo:this.photo,lang:this.lang});
    await this.modalController.dismiss();

  }

}
