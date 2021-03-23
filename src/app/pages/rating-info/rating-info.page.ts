import {Component, OnInit} from '@angular/core';
import {SellersService} from "../../services/sellers.service";
import {SellerModel} from "../../models/seller.model";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-rating-info',
  templateUrl: './rating-info.page.html',
  styleUrls: ['./rating-info.page.scss'],
})
export class RatingInfoPage implements OnInit {


  rating:any;

  constructor(private sellersService: SellersService) { }



  ngOnInit() {
    this.sellersService.getMy().pipe(first()).toPromise().then((seller)=>{
      if (seller.rating && seller.rating > 0) {
        this.rating = (seller.rating / 10).toFixed(1);
      } else {
        this.rating = '0.0';
      }
    })
  }

}
