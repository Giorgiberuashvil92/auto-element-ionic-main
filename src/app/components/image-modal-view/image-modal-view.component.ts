import {Component, Input} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-modal-view.component.html',
  styleUrls: ['./image-modal-view.component.scss'],
})
export class ImageModalViewComponent {

  @Input()
  img: string;

  sliderOpts = {centeredSlides: true, allowTouchMove: false};

  constructor(private modalController: ModalController) {
  }

  close() {
    this.modalController.dismiss();
  }

}
