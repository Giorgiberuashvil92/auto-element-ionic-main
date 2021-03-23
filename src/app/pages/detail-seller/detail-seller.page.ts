import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SellersService} from "../../services/sellers.service";
import {SellerModel} from "../../models/seller.model";
import {AdModel} from "../../models/ad.model";
import {AdsService} from "../../services/ads.service";

@Component({
  selector: 'app-detail-seller',
  templateUrl: './detail-seller.page.html',
  styleUrls: ['./detail-seller.page.scss'],
})
export class DetailSellerPage implements OnInit {

  id: string;
  adId: string;
  offerId: string;

  ad: AdModel;
  seller: SellerModel;
  loaded = false;

  constructor(
      private activateRoute: ActivatedRoute,
      private adsService: AdsService,
      private sellersService: SellersService
  ) { }

  async ngOnInit() {

    this.id = this.activateRoute.snapshot.params['id'];
    this.adId = this.activateRoute.snapshot.params['ad'];
    this.offerId = this.activateRoute.snapshot.params['offer'];

    this.seller = await this.getSellerCache();
    if (this.seller){this.loaded = true;}

    this.seller = await this.getSeller();
    this.loaded = true;

    if(this.adId){
      this.ad = await this.adsService.getByIdCache(this.adId);
      this.ad = await this.adsService.getById(this.adId);
    }

  }

  async getSeller() {
    return await this.sellersService.getByUid(this.id);
  }

  async getSellerCache() {
    return await this.sellersService.getByUidCache(this.id);
  }

  async doRefresh(event) {
    this.seller = await this.getSeller();
    setTimeout(() => {
      event.target.complete();
    }, 200);
  }

}
