import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { StitchService } from "./stitch.service";
import { AppCacheService } from "./storage.service";
import { first } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { SellersService } from "./sellers.service";
import { SellerModel } from "../models/seller.model";

@Injectable({
  providedIn: "root",
})
export class SubscriptionsService {
  subscriptionsCollection;
  sellersCollection;
  inited: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    private authService: AuthService,
    private stitchService: StitchService,
    private storageService: AppCacheService
  ) {}

  async init() {
    await this.stitchService.checkInitedDb();
    this.subscriptionsCollection = this.stitchService.db.collection(
      "subscriptions"
    );
    this.sellersCollection = this.stitchService.db.collection("users");
    this.inited.next(true);
  }

  async getCollection() {
    await this.inited.pipe(first()).toPromise();
    return await this.subscriptionsCollection;
  }

  async add(category: string, min: number, max: number) {
    category = this.transliterate(category);
    const data: any = { category };
    data.user = this.authService.getLogin();
    data.min = min;
    data.max = max;
    const user = JSON.parse(await this.storageService.getIonicStorage("user"));
    if (user.region) {
      data.region = user.region;
    } else {
      data.region = null;
    }
    if (user.state) {
      data.state = user.state;
    } else {
      data.state = null;
    }

    this.setStateRegionUser(data.user, data.state, data.region);

    return await (await this.getCollection()).insertOne(data);
  }

  async setYearSub(category: string, min: number, max: number) {
    const query = {
      user: this.authService.getLogin(),
      category: this.transliterate(category),
    };
    const update = { $set: { min, max } };
    return await (await this.getCollection()).updateOne(query, update);
  }

  async delete(category) {
    const query = {
      user: this.authService.getLogin(),
      category: this.transliterate(category),
    };
    return await (await this.getCollection()).deleteOne(query);
  }

  async setRegionUser(user: string, region: string) {
    return await (await this.getCollection()).updateMany(
      { user },
      { $set: { region } }
    );
  }

  async setStateUser(user: string, state: string) {
    return await (await this.getCollection()).updateMany(
      { user },
      { $set: { state } }
    );
  }

  async setStateRegionUser(user: string, state: string, region: string) {
    const data: any = {};
    if (state) {
      data.state = state;
    }
    if (region) {
      data.region = region;
    }

    if (!state && !region) return false;

    return await (await this.getCollection()).updateMany(
      { user },
      { $set: { ...data } }
    );
  }

  async get() {
    await this.authService.getStitchAuth();
    await this.authService.stateStitch.pipe(first()).toPromise();
    const query = { user: this.authService.getLogin() };
    const result = await (await this.getCollection()).find(query).toArray();
    this.setCache(result);
    return result;
  }

  async getCache() {
    return JSON.parse(
      await this.storageService.getIonicStorage("subscriptions")
    );
  }

  async setCache(subscriptions) {
    return await this.storageService.setIonicStorage(
      "subscriptions",
      JSON.stringify(subscriptions)
    );
  }

  async getSubscriptionCount(aliasCategory, region, year, state) {
    await this.authService.getStitchAuth();

    let query: any = {
      category: aliasCategory,
      $or: [
        {
          min: { $lte: parseInt(year) },
          max: { $gte: parseInt(year) },
        },
        {
          min: { $exists: false },
          max: { $exists: false },
        },
      ],
    };

    /*if (state !== 'Any'){
            query = {
                "category": aliasCategory,
                $and:[
                    {
                        $or : [{
                            min:{$lte:year},
                            max:{$gte:year},
                        },{
                            min:{$exists: false},
                            max:{$exists: false},
                        }]
                    },
                    {
                        $or : [{
                            state:state,
                        },{
                            state:{$exists: false},
                        }]
                    }
                ]
            }
        }*/

    if (region !== "AllCountry") {
      query.region = region;
    }

    return (await this.getCollection()).find(query).toArray();
  }

  async getSubscriptionsCount(category) {
    await this.authService.getStitchAuth();
    const subscriptions = category.models.map((model) => ({
      category: this.transliterate(`${category.name}_${model}`),
    }));
    const query = { $or: subscriptions };
    // const query = {"$or": [category:'mercedes-benz_200']};
    const res = await (await this.getCollection())
      .find(query, { projection: { _id: 0, user: 0 } })
      .toArray();
    return await res;
    // return res.map((subscription) => {return {category:subscription.category,region:subscription.region,min:subscription.min,max:subscription.max, state: subscription.state}});
  }

  async getSubscriptionsByCategory(categoryName: string, model: string) {
    await this.authService.getStitchAuth();
    // const subscriptions = category.models.map((model) => ());
    const query = { category: this.transliterate(`${categoryName}_${model}`) };
    // const query = {"$or": [category:'mercedes-benz_200']};
    const res = await (await this.getCollection())
      .find(query, { projection: { _id: 0, user: 0 } })
      .toArray();
    return await res;
    // return res.map((subscription) => {return {category:subscription.category,region:subscription.region,min:subscription.min,max:subscription.max, state: subscription.state}});
  }

  async getAvailableSubscriptionsByModels(models: Array<string>): Promise<any> {
    await this.authService.getStitchAuth();
    const res = await (await this.getCollection())
      .aggregate([
        {
          $group: { _id: "$category", count: { $sum: 1 } },
        },
        {
          $match: {
            _id: {
              $in: models,
            },
          },
        },
      ])
      .toArray();
    return await res;
  }

  async getSellersByIsVisible() {
    return new Promise((res, rej) => {
      this.authService.getStitchAuth();
      const sellersCollection = this.stitchService.db.collection("sellers");
      const pipeLine = [
        { $match: { visible: true } },
        {
          $project: {
            uid: 1,
            _id: 0,
          },
        },
      ];
      res(sellersCollection.aggregate(pipeLine).toArray());
    });
  }

  async getAvailableRegionsByCategory(category: string) {
    return this.getSellersByIsVisible().then((users) => {
      users = (users as Array<{ uid: string }>).map((user) => {
        return user.uid;
      });
      const res = this.subscriptionsCollection
        .aggregate([
          {
            $match: {
              user: {
                $in: users,
              },
            },
          },
          {
            $match: {
              category: category,
            },
          },
          {
            $group: { _id: "$region", count: { $sum: 1 } },
          },
        ])
        .toArray();
      return res;
    });
  }

  async getAvailableYearsByCategoryAndRegion(
    category: string,
    region: string,
    availableRegions?: Array<string>
  ) {
    return this.getSellersByIsVisible().then((users) => {
      users = (users as Array<{ uid: string }>).map((user) => {
        return user.uid;
      });
      console.log("Users in years: ", users);

      const res = this.subscriptionsCollection
        .aggregate([
          //   {
          //     $match: {
          //       user: {
          //         $in: users,
          //       },
          //     },
          //   },
          {
            $match: {
              $and: [
                {
                  user: {
                    $in: users,
                  },
                  category: category,
                  region:
                    region != "AllCountry" ? region : { $in: availableRegions },
                  //
                  // visible: true,
                },
              ],
            },
          },
          {
            $project: {
              min: 1,
              max: 1,
              _id: 0,
            },
          },
          // {
          //   $group: { _id: "$region", count: { $sum: 1 } },
          // },
        ])
        .toArray();
      console.log("years by is vis: ", res);

      return res;
    });
  }

  async getAvailableStatesByCategoryAndRegionAndYear(
    category: string,
    region: string,
    year: string,
    availableRegions?: Array<string>
  ) {
    return this.getSellersByIsVisible().then((users) => {
        users = (users as Array<{ uid: string }>).map((user) => {
            return user.uid;
          });
      const res = this.subscriptionsCollection
        .aggregate([
          {
            $match: {
              $and: [
                {
                  user: {
                    $in: users,
                  },
                },
                { category: category },
                {
                  region:
                    region != "AllCountry" ? region : { $in: availableRegions },
                },
                // { min: { $lte: parseInt(year) } },
                // { max: { $gte: parseInt(year) } },
              ],
            },
          },
          {
            $group: { _id: "$state", count: { $sum: 1 } },
          },
        ])
        .toArray();
      console.log("States: ", res);

      return res;
    });
    console.log("Category: ", category);
    console.log("region: ", region);
    //   print('Category: ', category);
  }

  // транлитерация
  transliterate(word: any): any {
    let answer = "";
    const a = {};

    a["Ё"] = "YO";
    a["Й"] = "I";
    a["Ц"] = "TS";
    a["У"] = "U";
    a["К"] = "K";
    a["Е"] = "E";
    a["Н"] = "N";
    a["Г"] = "G";
    a["Ш"] = "SH";
    a["Щ"] = "SCH";
    a["З"] = "Z";
    a["Х"] = "H";
    a["Ъ"] = "";
    a["ё"] = "yo";
    a["й"] = "i";
    a["ц"] = "ts";
    a["у"] = "u";
    a["к"] = "k";
    a["е"] = "e";
    a["н"] = "n";
    a["г"] = "g";
    a["ш"] = "sh";
    a["щ"] = "sch";
    a["з"] = "z";
    a["х"] = "h";
    a["ъ"] = "";
    a["Ф"] = "F";
    a["Ы"] = "I";
    a["В"] = "V";
    a["А"] = "a";
    a["П"] = "P";
    a["Р"] = "R";
    a["О"] = "O";
    a["Л"] = "L";
    a["Д"] = "D";
    a["Ж"] = "ZH";
    a["Э"] = "E";
    a["ф"] = "f";
    a["ы"] = "i";
    a["в"] = "v";
    a["а"] = "a";
    a["п"] = "p";
    a["р"] = "r";
    a["о"] = "o";
    a["л"] = "l";
    a["д"] = "d";
    a["ж"] = "zh";
    a["э"] = "e";
    a["Я"] = "Ya";
    a["Ч"] = "CH";
    a["С"] = "S";
    a["М"] = "M";
    a["И"] = "I";
    a["Т"] = "T";
    a["Ь"] = "";
    a["Б"] = "B";
    a["Ю"] = "YU";
    a["я"] = "ya";
    a["ч"] = "ch";
    a["с"] = "s";
    a["м"] = "m";
    a["и"] = "i";
    a["т"] = "t";
    a["ь"] = "";
    a["б"] = "b";
    a["ю"] = "yu";
    a[" "] = "_";
    a["("] = "";
    a[")"] = "";

    for (const i in word) {
      if (word.hasOwnProperty(i)) {
        if (a[word[i]] === undefined) {
          answer += word[i];
        } else {
          answer += a[word[i]];
        }
      }
    }
    return answer.toLowerCase();
  }
}
