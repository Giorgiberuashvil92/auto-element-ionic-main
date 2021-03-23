import { Injectable, NgZone } from "@angular/core";
import { AuthService } from "./auth.service";
import { StitchService } from "./stitch.service";
import { OfferModel } from "../models/offer.model";
import { SellersService } from "./sellers.service";
import { MessagesService } from "./messages.service";
import { MessageModel } from "../models/message.model";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppCacheService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class OffersService {
  offersCollection;
  public myOffers: BehaviorSubject<OfferModel[]> = new BehaviorSubject<
    OfferModel[]
  >([]);

  constructor(
    private authService: AuthService,
    private stitchService: StitchService,
    private sellersService: SellersService,
    private messagesService: MessagesService,
    private storageService: AppCacheService,
    private ngZone: NgZone
  ) {
    this.init();
  }

  async init() {
    await this.stitchService.checkInitedDb();
    this.offersCollection = this.stitchService.db.collection("offers");
  }

  async getOffersCache() {
    const offers = JSON.parse(
      await this.storageService.getIonicStorage("offers")
    );
    this.myOffers.next(offers);
  }

  async getOfferCacheByAd(id: string) {
    const offers = JSON.parse(
      await this.storageService.getIonicStorage(`offers_${id}`)
    );
    if (offers && offers.length) {
      const offer = offers.find((offer) => offer.ad == id);
      return offer ? [offer] : null;
    }
  }

  async add(offer: OfferModel, to: string) {
    offer.dateCreate = new Date();
    offer.user = this.authService.getLogin();
    const docId = await this.stitchService.callFunction("newOffer", offer);

    const message: MessageModel = new MessageModel();
    message.ad = offer.ad;
    message.to = to;
    message.offer = docId.toString();
    message.text = offer.text;

    await this.messagesService.add(message, false);
  }

  async getOffersByAd(ad: string, onlyMy = false, category?): Promise<any[]> {
    await this.authService.getStitchAuth();
    const query: any = { ad };
    if (onlyMy) {
      query.user = this.authService.getLogin();
    }
    const options = { sort: { dateCreate: -1 } };
    // old code
    // const offers = await this.offersCollection.find(query, options).toArray();
    return new Promise((res, rej) => {
      res(this.offersCollection.find(query, options).toArray());
    }).then((offers) => {
      console.log("Offers: ", offers);
      var store: Map<string, any> = new Map();
      (offers as Array<any>).forEach((element) => {
        store.set(element.user, {seller: null});
      });

      var sellers = [];
      return this.sellersService
        .getSellerByUidVisibleOmitted(null, Array.from(store.keys()))
        .then((res) => {
          sellers = res;
          sellers.forEach(seller => {
            store.get(seller.uid).seller = seller;
          });
          var result = [];
          (offers as Array<any>).forEach(async (offer, index) => {
            
            result.push({
              ...offer,
              userInfo: store.get(offer.user).seller,
              sub: store.get(offer.user).seller.subscriptions.filter(
                (sub) => sub.category == category
              )[0] != undefined ? store.get(offer.user).seller.subscriptions.filter(
                (sub) => sub.category == category
              )[0] : {vip: false, rating: 0},
            });
          });
          return result;
        });

    });

    // old code
    // return await Promise.all(offers.map(async (offer) => {
    //     // const seller = await this.sellersService.getSellerWSubByUid(offer.user);
    //     return {
    //         ...offer,
    //         // userInfo: seller,
    //         // sub: seller.subscriptions.filter((subscription) => subscription.category === category)[0]
    //     };
    // }));
    // await this.storageService.setIonicStorage(`offers_${ad}`, JSON.stringify(result));

  }

  async getOffersBySellerInit() {
    await this.authService.getStitchAuth();
    this.getOffersBySeller();
    const pipeline = {
      "fullDocument.user": this.authService.getLogin(),
    };
    this.stitchService
      .watch$(this.offersCollection, pipeline)
      .subscribe((data: any) => {
        const newOffer: OfferModel = data.fullDocument;
        if (data.operationType == "insert") {
          const offers = [...this.myOffers.getValue(), newOffer];
          this.ngZone.run(() => {
            this.myOffers.next(offers);
            this.storageService.setIonicStorage(
              "offers",
              JSON.stringify(offers)
            );
          });
        }
      });
  }

  async getOffersBySeller() {
    this.getOffersCache();
    let today = new Date();
    today.setDate(today.getDate() - 10);
    const query: any = {
      user: this.authService.getLogin(),
      dateCreate: { $gte: today },
    };
    const options = { sort: { dateCreate: -1 } };
    const offers = await this.offersCollection.find(query, options).toArray();
    this.myOffers.next(offers);
    await this.storageService.setIonicStorage("offers", JSON.stringify(offers));
  }

  getOfferItemByAd(ad: string): Observable<OfferModel> {
    return this.myOffers.pipe(
      map((items: OfferModel[]) => {
        return items.find((item: OfferModel) => item.ad === ad);
      })
    );
  }

  watch(ad: string) {
    const pipeline = { "fullDocument.ad": ad };
    return this.stitchService.watch$(this.offersCollection, pipeline);
  }
}
