import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddComponent} from "./add/add.component";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
  selector: 'app-ads',
  templateUrl: './ads.page.html',
  styleUrls: ['./ads.page.scss'],
})
export class AdsPage implements OnInit {

  region = '';
  langs = ['az','ka','kk','ru','uk','uz'];

  data = [];

  constructor(
      private modalController: ModalController,
      private afd: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.afd.list('/advertising').snapshotChanges().subscribe((res)=>{
      this.data = res.map((item)=>{
        return {id:item.key, ...item.payload.val()}
      });
    })
  }

  ChangeSelect(){

  }

  async addAd(){
    const adAdd = await this.modalController.create({
      component:AddComponent,
      componentProps:{lang:this.region},
      cssClass:'modal50'
    })
    await adAdd.present();
  }

  async deleteAd(id){
    return this.afd.list('/advertising').remove(id);
  }

}
