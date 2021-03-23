import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { AdModel } from "../../models/ad.model";
import { SubscriptionsService } from "../../services/subscriptions.service";
import { CoreService } from "../../services/core.service";
import { first, takeWhile } from "rxjs/operators";
import { SellersService } from "../../services/sellers.service";
import { SellerModel } from "../../models/seller.model";
import { OfferModel } from "../../models/offer.model";
import { OffersService } from "../../services/offers.service";
import { ReferencesService } from "../../services/references.service";
import { TranslatesService } from "../../services/translates.service";
import { Observable } from "rxjs";
import { MessageModel } from "../../models/message.model";
import { MessagesService } from "../../services/messages.service";
import { AdvertisingService } from "../../services/advertising.service";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.scss"],
})
export class OffersComponent implements OnInit, OnDestroy {
  private alive = true;

  loaded: boolean = false;
  seller: SellerModel = new SellerModel();
  client: SellerModel = new SellerModel();
  subsCount: number;

  @Input("ad") ad: AdModel;
  @Input("myAd") myAd: boolean;

  filter = "offers";

  offer: OfferModel = new OfferModel();

  offers: OfferModel[] = [];

  regions;
  cities: any;
  sellersLoading = true;
  sellersLoaded = false;
  offersLoading = true;

  public customPatterns = { A: { pattern: new RegExp("^[0-9]*[.]?[0-9]*?$") } };

  disableBtn: boolean = false;

  subscriptions;
  sellers: SellerModel[] = [];

  adv;

  uids;
  subscriptionsOffset: number = 0;
  showSellers: boolean = true;

  constructor(
    private coreService: CoreService,
    private offersService: OffersService,
    private subscriptionsService: SubscriptionsService,
    private sellersService: SellersService,
    private referencesService: ReferencesService,
    private translatesService: TranslatesService,
    private messagesService: MessagesService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private advService: AdvertisingService,
    private stateService: StateService
  ) {}

  responseChange(e) {
    if (!e.target.value && e.key == "0") {
      e.stopPropagation();
      e.preventDefault();
      this.offer.price = "";
    }
  }

  goToAdv(link) {
    window.location.href = link;
  }

  async ChangeSelect(seller: SellerModel, clear) {
    if (seller.region) {
      this.cities = await this.referencesService.getCityByRegion(seller.region);
      seller.city = clear ? null : seller.city;
    }
  }

  responseInput(e) {
    if (!e.data && e.target.value[0] === "0") {
      e.target.value = e.target.value.replace(/^0+/, "");
      this.offer.price = e.target.value;
    } else if (e.data === "0") {
      if (e.target.value[0] === "0") {
        e.target.value = e.target.value.replace(/^0/, "");
        this.offer.price = e.target.value;
      }
    }
  }

  async init() {
    if (this.myAd) {
      //await this.getSubscriptions();
      this.advService.getRandom().then((res) => {
        this.adv = res;
      });
      // this.offers = await this.offersService.getOfferCacheByAd(this.ad._id.toString());
      // if (this.offers) {
      //     this.loaded = true;
      // }
      // this.getSubscriptions();
      this.offersService
        .getOffersByAd(this.ad._id.toString(), false, this.ad.aliasCategory)
        .then((res) => {
          this.getSubscriptions();
          this.offers = res;
          (res as Array<any>).forEach(element => {
            console.log('Element: ', element);
          });
          this.offersLoading = false;
          // my
          // this.loaded = true;
        });
      // this.offersService.watch(this.ad._id.toString()).pipe(takeWhile(() => this.alive)).subscribe(() => {
      //     this.ngZone.run(async () => {
      //         this.offers = await this.offersService.getOffersByAd(this.ad._id.toString(), false, this.ad.aliasCategory);
      //     });
      //     this.cdr.detectChanges();
      // });
    } else if (!this.myAd) {
      console.log('Else if');
      
      this.offers = await this.offersService.getOfferCacheByAd(
        this.ad._id.toString()
      );
      if (this.offers) {
        // my
        this.loaded = true;
      }
      this.seller = await this.sellersService.getMy().pipe(first()).toPromise();
      this.client = await this.sellersService.getByUid(this.ad.user);
      this.offers = await this.offersService.getOffersByAd(
        this.ad._id.toString(),
        true
      );
      // my
      this.loaded = true;
    }
  }

  segmentChanged(ev) {
    this.filter = ev.detail.value;
  }

  callPhone(phone) {
    window.location.href = `tel:${phone}`;
  }

  async getSubscriptions() {
    //this.sellers = await this.sellersService.getSellerByUidCache(this.ad._id.toString());
    this.subscriptions = await this.subscriptionsService.getSubscriptionCount(
      this.ad.aliasCategory,
      this.ad.region,
      this.ad.year,
      this.ad.state
    );

    if (this.ad.state !== "Any") {
      this.subscriptions = this.subscriptions.filter((sub) => {
        return sub.state == this.ad.state || !sub.state || sub.state == "Any";
      });
    }
    //this.subsCount = this.subscriptions.length;
    this.uids = this.subscriptions.map((sub) => sub.user);
    // this.subsCount =  (await this.sellersService.getPotentialSellersByUid(this.ad._id.toString(), uids)).length;
    this.sellersService.getSellerCountByUid(null, this.uids).then(res => {
      // console.log('Count: ', res[0]["count"]);
      this.subsCount = res[0] ? res[0]["count"] : 0;
      this.loaded = this.offersLoading == false ? true :  false;
      this.sellersLoading =false;
    })
    this.sellers = await this.sellersService.getSellerByUid(
      this.ad._id.toString(),
      this.uids,
      this.subscriptionsOffset
    );
    this.sellersLoaded = true;
    this.loaded = true;
    
    
    // this.subsCount = (
    //   await this.sellersService.getSellerCountByUid(null, this.uids)
    // )[0]["count"];
  }

  async loadMoreSubscriptions($event) {
    console.log("Load more");
    console.log("Offset: ", this.subscriptionsOffset);

    this.subscriptionsOffset += 10;
    console.log("Offset: ", this.subscriptionsOffset);
    this.sellersService
      .getSellerByUid(
        this.ad._id.toString(),
        this.uids,
        this.subscriptionsOffset
      )
      .then((res) => {
        console.log("res: ", res);
        this.sellers.push(...res);
        this.showSellers = false;
        this.showSellers = true;
        console.log("Sellers: ", this.sellers);
        $event.target.complete();
        this.stateService.stateChanged.next(this.sellers);
      });
  }

  checkOffer(offer: OfferModel) {
    return (!offer.price && !offer.text) || this.disableBtn;
  }

  checkSeller(seller: SellerModel) {
    const phone =
      seller.phone.length <
      this.phoneLength(this.translatesService.getWord("NumberLength"));
    return (
      !seller.name ||
      !seller.city ||
      phone ||
      !seller.address ||
      this.disableBtn
    );
  }

  ngOnInit() {
    this.init();
    this.referencesService.getAllRegions().then((regions) => {
      this.regions = regions;
    });
    this.coreService.dataRefresh
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.init());
  }

  ngOnDestroy() {
    this.alive = false;
  }

  phoneLength(numberLength) {
    return parseInt(numberLength);
  }

  async addSellerAndOffer(seller: SellerModel, offer: OfferModel) {
    this.disableBtn = true;
    await this.sellersService.update(seller);
    await this.addOffer(offer);
  }

  getUnread(collection, id): Observable<MessageModel[]> {
    return this.messagesService.getUnreadItem(collection, id);
  }

  async addOffer(offer) {
    this.disableBtn = true;
    await this.coreService.presentLoading("SendOffer");

    offer.ad = this.ad._id.toString();
    if (!this.offer.text || !this.offer.text.length) {
      offer.text = `${this.translatesService.getWord("notTextResponse")}`;
    } else {
      offer.text = `${offer.text}${this.translatesService.getWord(
        "responseTemplate"
      )}`;
    }

    await this.offersService.add(offer, this.ad.user);
    this.coreService.dataRefresh.next();
    await this.coreService.dismissLoading();
    this.disableBtn = false;
  }

  async notHaveOffer(offer) {
    this.disableBtn = true;
    await this.coreService.presentLoading("SendOffer");
    offer.ad = this.ad._id.toString();
    offer.text = `${this.translatesService.getWord(
      "NotAvailableTextResponse"
    )}`;
    offer.not_available = true;
    await this.offersService.add(offer, this.ad.user);
    this.coreService.dataRefresh.next();
    await this.coreService.dismissLoading();
    this.disableBtn = false;
  }
}
