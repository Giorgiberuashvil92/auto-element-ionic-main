import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { AuthService } from "./auth.service";
import { StitchService } from "./stitch.service";
import { TranslatesService } from "./translates.service";
import { SellerModel } from "../models/seller.model";
import { first, map } from "rxjs/operators";
import { AppCacheService } from "./storage.service";
import { AdModel } from "../models/ad.model";
import { SubscriptionsService } from "./subscriptions.service";

@Injectable({
  providedIn: "root",
})
export class SellersService {
  sellerSource$: ReplaySubject<SellerModel> = new ReplaySubject(1);
  seller$: Observable<SellerModel> = this.sellerSource$.asObservable();

  allSellersSource$: ReplaySubject<SellerModel[]> = new ReplaySubject(1);
  allSellers$: Observable<
    SellerModel[]
  > = this.allSellersSource$.asObservable();

  sellersCollection;

  constructor(
    private authService: AuthService,
    private stitchService: StitchService,
    private translatesService: TranslatesService,
    private storageService: AppCacheService,
    private subscriptionService: SubscriptionsService
  ) {
    this.init();
  }

  async init() {
    await this.stitchService.checkInitedDb();
    this.sellersCollection = this.stitchService.db.collection("users");
  }

  async update(seller: SellerModel) {
    seller.uid = this.authService.getLogin();
    const prefix = this.translatesService.getWord("NumberPrefix");
    seller.phone = prefix + seller.phone.replace(/\D+/g, "");
    seller.visible = true;
    await this.sellersCollection.updateOne(
      { uid: seller.uid },
      { $set: seller }
    );
    await this.subscriptionService.setRegionUser(seller.uid, seller.region);
    this.getMyRefresh();
  }

  async updateStateRepair(state) {
    const uid = this.authService.getLogin();
    await this.sellersCollection.updateOne({ uid }, { $set: { state } });
    await this.subscriptionService.setStateUser(uid, state);
    this.getMyRefresh();
  }

  async getSellersRefresh() {
    await this.authService.getStitchAuth();
    const query = { role: "seller", visible: true };
    const res = await this.sellersCollection.find(query).toArray();
    this.allSellersSource$.next(res);
    await this.storageService.setIonicStorage(
      "allSellers",
      JSON.stringify(res)
    );
  }

  async getSellersCache() {
    const allSellers = JSON.parse(
      await this.storageService.getIonicStorage("allSellers")
    );
    this.allSellersSource$.next(allSellers);
  }

  getSellers(): Observable<SellerModel[]> {
    this.getSellersRefresh();
    return this.allSellers$;
  }

  async getByUid(uid: string) {
    await this.authService.getStitchAuth();
    const query = { uid };
    return await this.sellersCollection.findOne(query);
  }

  async getSellerWSubByUid(uid: string) {
    await this.authService.getStitchAuth();
    const query = { uid };
    const sellersCollection = this.stitchService.db.collection("sellers");
    return await sellersCollection.findOne(query);
  }

  async getByUidCache(uid: string) {
    const allSellers: SellerModel[] = JSON.parse(
      await this.storageService.getIonicStorage("allSellers")
    );
    if (allSellers && allSellers.length) {
      return allSellers.find((seller) => seller.uid === uid);
    }
  }

  async getPotentialSellersByUid(id, uids: string[]) {
    await this.authService.getStitchAuth();
    const query = {
      $or: [{ inactiveTime: false }, { inactiveTime: { $exists: false } }],
      uid: { $in: uids },
    };
    const sellersCollection = this.stitchService.db.collection("sellers");
    const res = await sellersCollection.find(query).toArray();
    await this.storageService.setIonicStorage(
      `sellers_${id}`,
      JSON.stringify(res)
    );
    return res;
  }

  

 

  async getSellerByUid(id, uids: string[], offset: number) {
    await this.authService.getStitchAuth();
    const query = {
      visible: true,
      uid: { $in: uids },
    };
    const sellersCollection = this.stitchService.db.collection("sellers");
    const pipeLine = [
      { $match: { visible: true } },
      { $match: { uid: { $in: uids } } },
      { $sort: {rating: -1}},
      { $skip: offset },
      { $limit: 10 },
    ];
    const res = await sellersCollection.aggregate(pipeLine).toArray();
    await this.storageService.setIonicStorage(
      `sellers_${id}`,
      JSON.stringify(res)
    );
    return res;
  }

  async getSellerCountByUid(id, uids: string[]): Promise<number> {
    await this.authService.getStitchAuth();
    const query = {
      visible: true,
      uid: { $in: uids },
    };
    const sellersCollection = this.stitchService.db.collection("sellers");
    const pipeLine = [
      { $match: { visible: true } },
      { $match: { uid: { $in: uids } } },
      { $count: "count" },
    ];
    const res = await sellersCollection.aggregate(pipeLine).toArray();
    // await this.storageService.setIonicStorage(
    //   `sellers_${id}`,
    //   JSON.stringify(res)
    // );
    return new Promise((res, rej) => {
        res(sellersCollection.aggregate(pipeLine).toArray());
    });
    // return res;
  }

  async getSellerByUidVisibleOmitted(id, uids: string[]) {
    await this.authService.getStitchAuth();
    const query = {
      uid: { $in: uids },
    };
    const sellersCollection = this.stitchService.db.collection("sellers");
    const res = await sellersCollection.find(query).toArray();
    await this.storageService.setIonicStorage(
      `sellers_${id}`,
      JSON.stringify(res)
    );
    return res;
  }

  async getSellerByUidCache(id) {
    const allSellers: SellerModel[] = JSON.parse(
      await this.storageService.getIonicStorage(`sellers_${id}`)
    );
    if (allSellers && allSellers.length) {
      return allSellers;
    } else {
      return [];
    }
  }

  getSellersRegions() {
    return this.getSellers().pipe(
      map((sellers) => {
        return sellers.map((seller) => seller.region);
      })
    );
  }

  async getMyRefresh() {
    await this.authService.getStitchAuth();
    const query = { uid: this.authService.getLogin() };
    const user = await this.sellersCollection.findOne(query);
    await this.storageService.setIonicStorage("user", JSON.stringify(user));
    this.sellerSource$.next(user);
  }

  getMy(): Observable<SellerModel> {
    this.getMyRefresh();
    return this.seller$;
  }
}
