import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { AdModel } from "../../models/ad.model";
import { CoreService } from "../../services/core.service";
import { ReferencesService } from "../../services/references.service";
import { AdsService } from "../../services/ads.service";
import { SubscriptionsService } from "../../services/subscriptions.service";
import { SellersService } from "../../services/sellers.service";
import { TranslatesService } from "../../services/translates.service";
import { PickerController } from "@ionic/angular";
import { AppCacheService } from "../../services/storage.service";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { first } from "rxjs/operators";

@Component({
  selector: "app-add-ads",
  templateUrl: "./add-ads.page.html",
  styleUrls: ["./add-ads.page.scss"],
})
export class AddAdsPage implements OnInit, OnDestroy {
  ad: AdModel = new AdModel();

  categoryList: any;
  regionList: any;
  category: any;
  models: any;
  activeModels: any = null;
  activeYears: any = [];
  activeStates: any = [];

  years = [];

  availableModels = [];
  availableRegions = [];

  showModels = false;
  showRegions = false;
  showYears = false;
  showStates = false;

  regionsLoaded = false;
  yearsLoaded = false;
  statesLoaded = false;

  loadCachedModel = false;

  data: any = {};

  constructor(
    private coreService: CoreService,
    private referencesService: ReferencesService,
    private adsService: AdsService,
    private sellersService: SellersService,
    private subscriptionsService: SubscriptionsService,
    public pickerCtrl: PickerController,
    private translatesService: TranslatesService,
    private storageService: AppCacheService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.categoryList = this.referencesService.getAllCategories();
    this.regionList = await this.referencesService.getAllRegions();

    this.createYears();

    let lastAd = await this.storageService.get("lastAd");
    if (lastAd) {
        this.loadCachedModel = true;
      console.log("found last ad");
      lastAd = JSON.parse(lastAd);
      console.log("Last ad: ", lastAd);
      this.data = lastAd;
      this.ad.category = lastAd.category;

      this.ad.state = lastAd.state;
      this.ad.vin = lastAd.vin;

      await this.ChangeSelect(this.ad.category);

      await this.changeModel();

      if (this.checkModel(lastAd.model)) return;
      console.log("After check");

      this.ad.model = lastAd.model;
    //   this.cdr.detectChanges();
    //   await this.changeModel(this.data.model);
      this.ad.aliasCategory = lastAd.aliasCategory;
      console.log("AD on 71: ", this.ad);

      //   setTimeout(async () => {
      //     if (lastAd.region == "AllCountry") {
      //       this.ad.region = lastAd.region;
      //     } else if (
      //       this.checkRegion(lastAd.region) &&
      //       lastAd.region !== "AllCountry"
      //     )
      //       return;
      //     this.ad.region = lastAd.region;
      //     await this.changeRegion();
      //     setTimeout(async () => {
      //       if (this.activeYears.indexOf(Number(lastAd.year)) < 0) return;
      //       this.ad.year = lastAd.year;
      //       await this.changeYear();

      //       setTimeout(async () => {
      //         if (this.activeStates.includes("Any")) {
      //           this.ad.state = lastAd.state;
      //         } else if (this.activeStates.indexOf(lastAd.state) < 0) {
      //           return;
      //         }
      //         this.ad.state = lastAd.state;
      //       }, 20);
      //     }, 20);
      //   }, 20);
    }
  }

  async ngOnDestroy() {
    this.ad.category = null;
    this.ad.model = null;
    this.ad.region = null;
    this.ad.state = null;
    this.ad.year = null;
  }

  createYears() {
    const nowYear = new Date().getFullYear();
    for (let i = nowYear; i >= nowYear - 100; i--) {
      this.years.push(i);
    }
  }

  async ChangeSelect(category) {
    this.showModels = false;
    this.showRegions = false;
    this.showYears = false;
    this.showStates = false;
    this.regionsLoaded = false;
    this.yearsLoaded = false;
    this.statesLoaded = false;
    this.ad.category = category;
    await this.coreService.presentLoading("Load");
    this.activeModels = null;
    this.category = this.referencesService.getByCategory(this.ad.category);
    this.ad.model = null;
    this.ad.region = null;
    this.ad.state = null;
    this.ad.year = null;
    this.models = this.category.models;
    console.log("Models: ", this.models);

    this.activeModels = {};
    (this.models as Array<string>).forEach((model) => {
      this.activeModels[
        this.subscriptionsService.transliterate(
          `${this.category.name}_${model}`
        )
      ] = {};
    });
    // this.activeModels = this.models.reduce((model) => {
    //     console.log('model: ', model.key);
    //     console.log('model: ', model.value);
    //     var obj = {};
    //     obj[this.subscriptionsService.transliterate(`${this.category.name}_${model}`)] = {};
    //     console.log('obj: ', obj);

    //     return obj;
    // }, {});
    console.log("Active models in ts: ", this.activeModels);
    // this.activeModels = this.models;

    //old code
    // this.activeModels = await this.subscriptionsService.getSubscriptionsCount(this.category);
    this.subscriptionsService
      .getAvailableSubscriptionsByModels(Object.keys(this.activeModels))
      .then((res) => {
        console.log("Result: ", res);
        (res as Array<{ _id: string; count: number }>).forEach(
          (element, index) => {
            if (element.count > 0) {
              var obj = {};
              obj[element._id] = { min: 1920, max: 2020 };
              this.availableModels.push(element._id);
            }
          }
        );
        console.log("Available models: ", this.availableModels);
        // this.activeModels = this.availableModels;
        this.showModels = true;
        this.cdr.detectChanges();
      });

    // this.activeModels = this.activeModels.reduce((acc: { category, state, region, max, min }, el) => {
    //     acc[el.category] = {
    //         region: acc[el.category] ? [...new Set(acc[el.category].region.concat(el.region || 'AllCountry'))] : [el.region || 'AllCountry'],
    //         years_state: acc[el.category] && acc[el.category]['years_state'] ? acc[el.category]['years_state'] : {}
    //     };
    //     if (!acc[el.category]['years_state']) {
    //         acc[el.category]['years_state'] = {
    //             [el.region || 'AllCountry']: [{
    //                 min: el.min || 1920,
    //                 max: el.max || 2020,
    //                 state: el.state || 'Any'
    //             }]
    //         }
    //     } else if (!acc[el.category]['years_state'][el.region || 'AllCountry']) {
    //         acc[el.category]['years_state'][el.region || 'AllCountry'] = [{
    //             min: el.min || 1920,
    //             max: el.max || 2020,
    //             state: el.state || 'Any'
    //         }];
    //     } else if (acc[el.category]['years_state'][el.region || 'AllCountry']) {
    //         acc[el.category]['years_state'][el.region || 'AllCountry'] = acc[el.category]['years_state'][el.region || 'AllCountry'].concat({
    //             min: el.min || 1920,
    //             max: el.max || 2020,
    //             state: el.state || 'Any'
    //         });
    //     }
    //     return acc
    // }, {});
    console.log("Active models: ", this.activeModels);

    await this.coreService.dismissLoading();
    this.cdr.detectChanges();
  }

  async changeModel() {
    this.showRegions = false;
    this.showYears = false;
    this.showStates = false;
    this.regionsLoaded = false;
    this.yearsLoaded = false;
    this.statesLoaded = false;

    // this.ad.model = model;
    // console.log("model: ", model);

    this.availableRegions = [];
    this.subscriptionsService
      .getAvailableRegionsByCategory(
        this.subscriptionsService.transliterate(
          `${this.ad.category}_${this.ad.model}`
        )
      )
      .then((res) => {
        //   this.availableRegions = [];
        // console.log("Regions: ", res);
        (res as Array<{ _id: string; count: number }>).forEach((element) => {
          if (element.count > 0) {
            this.availableRegions.push(element._id);
          }
        });
        // console.log("Available regions: ", this.availableRegions);

        // this.availableRegions = res;
        this.ad.region = null;
        this.ad.state = null;
        this.ad.year = null;
        // console.log("aa", this.data.model);

        // if (model == this.data.model) {
        //   this.ad.model = this.data.model;
        // }
        this.showRegions = true;
        this.regionsLoaded = true;
        if (this.loadCachedModel) {
            this.ad.model = this.data.model;
            this.loadCachedModel = false;
        }
        this.cdr.detectChanges();
      });
  }

  checkModel(model) {
    if (this.availableModels) {
      // console.log('model: ', model);
      // console.log('Trs: ', this.subscriptionsService.transliterate(`${this.ad.category}_${model}`));

      // const subs = Object.keys(this.activeModels);
      return (
        this.availableModels.indexOf(
          this.subscriptionsService.transliterate(
            `${this.ad.category}_${model}`
          )
        ) < 0
      );
      const subs = this.activeModels;
      return (
        subs.indexOf(
          this.subscriptionsService.transliterate(
            `${this.ad.category}_${model}`
          )
        ) < 0
      );
      // return false;
    }
  }

  checkRegion(region) {
    // const subs = this.activeModels[this.subscriptionsService.transliterate(`${this.ad.category}_${this.ad.model}`)] || [];
    // if (subs.region) {
    //     return !subs.region.includes(region);
    // } else {
    //     return true;
    // }
    // console.log("Region: ", region);

    return !this.availableRegions.includes(region);
  }

  async changeRegion() {
    this.yearsLoaded = false;
    this.statesLoaded = false;
    this.showYears = false;
    this.showStates = false;
    this.subscriptionsService
      .getAvailableYearsByCategoryAndRegion(
        this.subscriptionsService.transliterate(
          `${this.ad.category}_${this.ad.model}`
        ),
        this.ad.region,
        this.availableRegions
      )
      .then((res) => {
        // console.log("Years available: ", res);
        var years = [];
        (res as Array<{ min: number; max: number }>).forEach((range) => {
          for (let i = range.min; i <= range.max; i++) {
            years.push(i);
          }
        });
        // console.log("Available years: ", years);
        this.activeYears = [...years].sort((a, b) => b - a);
        this.ad.state = null;
        this.ad.year = null;
        this.yearsLoaded = true;
        this.showYears = true;
        this.cdr.detectChanges();
      });
    // const min = new Date().getFullYear() - 100;
    // const max = new Date().getFullYear();
    // for (let i = min; max >= i; i++) {
    //   years.add(i);
    // }
    // if (this.ad.region == "AllCountry") {
    //   Object.keys(
    //     this.activeModels[
    //       this.subscriptionsService.transliterate(
    //         `${this.ad.category}_${this.ad.model}`
    //       )
    //     ]["years_state"]
    //   ).map((key, index) => {
    //     this.activeModels[
    //       this.subscriptionsService.transliterate(
    //         `${this.ad.category}_${this.ad.model}`
    //       )
    //     ]["years_state"][key].map((subscription) => {
    //       const min = subscription.min
    //         ? subscription.min
    //         : new Date().getFullYear() - 100;
    //       const max = subscription.max
    //         ? subscription.max
    //         : new Date().getFullYear();
    //       for (let i = min; max >= i; i++) {
    //         years.add(i);
    //       }
    //     });
    //   });
    // } else {
    //   this.activeModels[
    //     this.subscriptionsService.transliterate(
    //       `${this.ad.category}_${this.ad.model}`
    //     )
    //   ]["years_state"][this.ad.region].map((subscription) => {
    //     const min = subscription.min
    //       ? subscription.min
    //       : new Date().getFullYear() - 100;
    //     const max = subscription.max
    //       ? subscription.max
    //       : new Date().getFullYear();
    //     for (let i = min; max >= i; i++) {
    //       years.add(i);
    //     }
    //   });
    // }
  }

  changeYear() {
    console.log("Change year");
    this.statesLoaded = false;
    const states = new Set([]);
    this.subscriptionsService
      .getAvailableStatesByCategoryAndRegionAndYear(
        this.subscriptionsService.transliterate(
          `${this.ad.category}_${this.ad.model}`
        ),
        this.ad.region,
        this.ad.year,
        this.availableRegions
      )
      .then((res) => {
        console.log("States: ", res);
        this.activeStates = [];
        var states = [];
        (res as Array<{ _id: string; count: number }>).forEach((state) => {
          if (state.count > 0) {
            states.push(state._id);
          }
        });
        this.activeStates = [...states];
        this.ad.state = null;
        this.statesLoaded = true;
        this.cdr.detectChanges();
      });
    // if (this.ad.region == "AllCountry") {
    //   Object.keys(
    //     this.activeModels[
    //       this.subscriptionsService.transliterate(
    //         `${this.ad.category}_${this.ad.model}`
    //       )
    //     ]["years_state"]
    //   ).map((key, index) => {
    //     const subs = this.activeModels[
    //       this.subscriptionsService.transliterate(
    //         `${this.ad.category}_${this.ad.model}`
    //       )
    //     ]["years_state"][key].filter((subs) => {
    //       return subs.min <= this.ad.year && subs.max >= this.ad.year;
    //     });
    //     subs.map((subscription) => {
    //       states.add(subscription.state);
    //     });
    //   });
    // } else {
    //   const subs = this.activeModels[
    //     this.subscriptionsService.transliterate(
    //       `${this.ad.category}_${this.ad.model}`
    //     )
    //   ]["years_state"][this.ad.region].filter((subs) => {
    //     return subs.min <= this.ad.year && subs.max >= this.ad.year;
    //   });
    //   subs.map((subscription) => {
    //     states.add(subscription.state);
    //   });
    // }
    // this.activeStates = [...states];
  }

  activeStatesDisable(state) {
    if (state == "Any")
      return (
        this.activeStates.includes("Any") ||
        (this.activeStates.includes("Used") &&
          this.activeStates.includes("New"))
      );
    return (
      this.activeStates.includes("Any") || this.activeStates.includes(state)
    );
  }

  bindAlert(err) {
    setTimeout(() => {
      let elems = document.querySelectorAll(
        ".alert-radio-button[disabled] .alert-button-inner"
      );
      for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener("click", (e) => {
          this.coreService.presentToast(err, "danger");
        });
      }
    }, 100);
  }

  async openPicker() {
    let allYears = [];
    const nowYear = new Date().getFullYear();
    for (let i = nowYear; i >= nowYear - 100; i--) {
      allYears.push({ text: i.toString(), value: i, disabled: true });
    }

    let options = [];
    this.activeYears.forEach((val) => {
      options.push({ text: val.toString(), value: val, disabled: false });
    });
    const picker = await this.pickerCtrl.create({
      buttons: [
        {
          text: this.translatesService.getWord("Cancel"),
          role: "cancel",
        },
        {
          text: this.translatesService.getWord("Ok"),
          handler: (a) => {
            this.ad.year = a.year.value;
            this.ad.state = null;
          },
        },
      ],
      columns: [
        {
          name: "year",
          options,
          ...allYears,
        },
      ],
    });
    await picker.present();
  }

  checkAd(ad: AdModel) {
    return (
      !ad.description ||
      !ad.category ||
      !ad.model ||
      !ad.year ||
      !ad.region ||
      !ad.state
    );
  }

  async addAd(ad) {
    //   console.log(JSON.stringify(ad));

    await this.storageService.set("lastAd", JSON.stringify(ad));
    await this.coreService.presentLoading("CreateAd");
    const adId = await this.adsService.add(ad);
    await this.coreService.dismissLoading();
    await this.coreService.goRoot("/detail", adId, "forward");
  }
}
