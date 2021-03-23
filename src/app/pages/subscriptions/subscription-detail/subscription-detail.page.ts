import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReferencesService} from "../../../services/references.service";
import {SubscriptionsService} from "../../../services/subscriptions.service";
import {AdsService} from "../../../services/ads.service";
import {AppCacheService} from "../../../services/storage.service";
import {PickerController} from "@ionic/angular";
import {TranslatesService} from "../../../services/translates.service";
import {CoreService} from "../../../services/core.service";

@Component({
    selector: 'app-subscription-detail',
    templateUrl: './subscription-detail.page.html',
    styleUrls: ['./subscription-detail.page.scss'],
})
export class SubscriptionDetailPage implements OnInit {

    id: string;
    category;

    subscriptions;
    subscriptionsYears = [];
    settings = [];

    trackByFn(index: number) {
        return index;
    }

    constructor(
        private activateRoute: ActivatedRoute,
        private subscriptionsService: SubscriptionsService,
        private referencesService: ReferencesService,
        private adsService: AdsService,
        private coreService: CoreService,
        private storageService: AppCacheService,
        private translatesService: TranslatesService,
        private pickerController: PickerController,
        private cdr: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {
        this.id = this.activateRoute.snapshot.params['id'];
        this.category = this.referencesService.getByCategory(this.id);

        this.subscriptions = await this.subscriptionsService.getCache();

        if (this.subscriptions)
            this.setToggles();

        this.subscriptions = await this.subscriptionsService.get();
        this.setToggles();

    }

    setToggles() {
        this.subscriptions.forEach((subscription) => {
            this.subscriptionsYears[subscription.category] =
                {
                    min:subscription.min ? subscription.min : new Date().getFullYear() - 100,
                    max:subscription.min ? subscription.max : new Date().getFullYear(),
                }
        });
        this.subscriptions = this.subscriptions.map((subscription) => subscription.category);
        this.settings = this.category.models.map((model) => {
            return this.subscriptions.includes(this.subscriptionsService.transliterate(`${this.category.name}_${model}`));
        });
    }

    checkYears(model){
        return this.subscriptionsYears[this.subscriptionsService.transliterate(`${this.category.name}_${model}`)];
    }

    async changeSubscription(event, subscription, index) {
        if (!event.target.checked) {
            const min = new Date().getFullYear() - 100;
            const max = new Date().getFullYear();
            this.subscriptionsYears[this.subscriptionsService.transliterate(`${this.category.name}_${subscription}`)] = {min, max};
            await this.subscriptionsService.add(`${this.category.name}_${subscription}`, min, max);
        } else {
            await this.subscriptionsService.delete(`${this.category.name}_${subscription}`);
        }
        await this.adsService.getAll();
        this.settings[index] = event.target.checked;
        this.cdr.detectChanges();
    }


    async openChangeYears(subscription) {

        const years = this.subscriptionsYears[this.subscriptionsService.transliterate(`${this.category.name}_${subscription}`)];

        let min = [];
        const nowYear = new Date().getFullYear();
        for (let i = nowYear; i >= nowYear - 100; i--) {
            min.push({text: i.toString(), value: i});
        }
        let max = [];
        for (let i = nowYear; i >= nowYear - 100; i--) {
            max.push({text: i.toString(), value: i});
        }
        const picker = await this.pickerController.create({
            columns: [{name: 'min', options: min, selectedIndex: nowYear - years.min}, {name: 'max', options: max, selectedIndex: nowYear - years.max}],
            buttons: [
                {
                    text: this.translatesService.getWord('Cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translatesService.getWord('Ok'),
                    handler: (values) => {

                        if (values.max.value < values.min.value) {
                            this.coreService.presentToast('subscriptionErrorDate', 'danger', 5000);
                            this.openChangeYears(subscription);
                        } else {
                            this.subscriptionsService.setYearSub(`${this.category.name}_${subscription}`, values.min.value, values.max.value);
                            this.subscriptionsYears[this.subscriptionsService.transliterate(`${this.category.name}_${subscription}`)] = {min:values.min.value, max:values.max.value};
                            this.cdr.detectChanges();
                        }
                    }
                }
            ]
        });

        await picker.present();
    }

}
