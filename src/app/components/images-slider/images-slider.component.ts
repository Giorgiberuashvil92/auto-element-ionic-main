import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ImageModalViewComponent} from "../image-modal-view/image-modal-view.component";

@Component({
  selector: 'images-slider',
  inputs:['img','height','radius','pager'],
  templateUrl: './images-slider.component.html',
  styleUrls: ['./images-slider.component.scss'],
})
export class ImagesSliderComponent implements OnInit {

  @Input()

  img: Array<string>;
  height:string = '250px';
  radius:string = '0';
  pager:boolean = true;

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {}

  async openPreview(img) {
    const modal = await this.modalController.create({
      component: ImageModalViewComponent,
      componentProps: {img: img}
    });
    await modal.present();
  }

}
