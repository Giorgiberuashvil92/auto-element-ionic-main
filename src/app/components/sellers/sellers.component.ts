import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import { StateService } from "src/app/services/state.service";
import { SellerModel } from "../../models/seller.model";

@Component({
  selector: "sellers",
  templateUrl: "./sellers.component.html",
  styleUrls: ["./sellers.component.scss"],
})
export class SellersComponent implements OnInit, OnChanges, OnDestroy {
  _sellers = [];
  @Input() category: string;
  @Output() loadMoreEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() sellersArray = [];
  @Input() sellersCount;
  @Input() sellersLoaded = false;
  @Input() set sellers(sellers) {
    if (sellers && this.category) {
      this._sellers = sellers.map((seller: any) => {
        return {
          ...seller,
          sub: seller.subscriptions.filter(
            (subscription) => subscription.category === this.category
          )[0],
        };
      });
    }
  }

  trackByFn(index: number, item: SellerModel) {
    return item._id.toString();
  }

  constructor(private stateService: StateService) {}

  ngOnChanges() {
    console.log("New data: ", this.sellersArray);
  }

  ngOnInit() {
    this.stateService.stateChanged.subscribe((sellers) => {
      console.log("New sellers: ", sellers);
      this._sellers = sellers.map((seller: any) => {
        return {
          ...seller,
          sub: seller.subscriptions.filter(
            (subscription) => subscription.category === this.category
          )[0],
        };
      });
    });
  }

  callPhone(phone) {
    window.location.href = `tel:${phone}`;
  }

  loadMore($event) {
    console.log($event);
    this.loadMoreEmitter.emit($event);
  }

  ngOnDestroy() {
    // this.stateService.stateChanged.unsubscribe();
  }
}
