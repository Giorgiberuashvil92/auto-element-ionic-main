import { Component, OnInit } from '@angular/core';
import {AdModel} from "../../../models/ad.model";
import {SellersService} from "../../../services/sellers.service";
import {Observable} from "rxjs";
import {SellerModel} from "../../../models/seller.model";

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage {

  sellers: Observable<SellerModel[]>;

  trackByFn(index: number, item: SellerModel) {
    return item._id.toString();
  }

  itemHeightFn(item, index) {
    return 130;
  }

  constructor(private sellersService: SellersService) {
  }

  ionViewDidEnter() {
    this.getAllSellers();
    this.sellersService.getSellersCache();
  }

  getAllSellers() {
    this.sellers = this.sellersService.getSellers();
  }

  async doRefresh(event) {
    await this.getAllSellers();
    setTimeout(() => {
      event.target.complete();
    }, 200);
  }

}
