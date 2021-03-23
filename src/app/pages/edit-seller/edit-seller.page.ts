import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SellerModel} from "../../models/seller.model";
import {SellersService} from "../../services/sellers.service";
import {CoreService} from "../../services/core.service";
import {ReferencesService} from "../../services/references.service";
import {first} from "rxjs/operators";
import {TranslatesService} from "../../services/translates.service";

@Component({
    selector: 'app-edit-seller',
    templateUrl: './edit-seller.page.html',
    styleUrls: ['./edit-seller.page.scss'],
})
export class EditSellerPage implements OnInit {

    disabled = false;

    seller: SellerModel;

    regions;
    cities: any;

    constructor(
        private coreService: CoreService,
        private sellersService: SellersService,
        private referencesService: ReferencesService,
        private translatesService: TranslatesService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.getMy();
        this.referencesService.getAllRegions().then((regions) => {
            this.regions = regions;
        });
    }

    phoneLength(numberLength){
        return parseInt(numberLength);
    }

    async ChangeSelect(seller: SellerModel, clear) {
        if (seller.region) {
            this.cities = await this.referencesService.getCityByRegion(seller.region);
            seller.city = clear ? null : seller.city;
        }
        this.cdr.detectChanges();
    }

    async getMy() {
        this.seller = await this.sellersService.getMy().pipe(first()).toPromise();
        this.ChangeSelect(this.seller, false);
    }

    async update(seller: SellerModel) {
        this.disabled = true;
        await this.sellersService.update(seller);
        await this.coreService.goRoot('/tabs/settings',null,'back');
        this.disabled = false;
    }

    checkSeller(seller: SellerModel) {
        const phone = seller.phone.length < this.phoneLength(this.translatesService.getWord('NumberLength'));
        return !seller.name || !seller.city || phone || !seller.address || this.disabled;
    }

}
