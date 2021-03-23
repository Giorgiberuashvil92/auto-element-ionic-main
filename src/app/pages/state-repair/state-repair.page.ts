import {Component, OnInit} from '@angular/core';
import {SellersService} from "../../services/sellers.service";
import {first} from "rxjs/operators";

@Component({
    selector: 'app-state-repair',
    templateUrl: './state-repair.page.html',
    styleUrls: ['./state-repair.page.scss'],
})
export class StateRepairPage implements OnInit {

    used = true;
    new = true;

    constructor(
        private sellersService: SellersService
    ) {
    }

    async ngOnInit() {
        const user = await this.sellersService.getMy().pipe(first()).toPromise();
        if (user.state && user.state !== 'Any') {
            this.new = user.state == 'New';
            this.used = user.state == 'Used';
        }
    }


    async toggle(event, state) {
        let newState = this.new;
        let usedState = this.used;

        let stateRepair;

        if (event.target.checked) {
            if (state == 'New') newState = false;
            if (state == 'Used') usedState = false;

            stateRepair = state == 'New' ? 'Used' : 'New';

            if (!newState && !usedState) {
                this.new = true;
                this.used = true;
                stateRepair = state == 'New' ? 'Used' : 'New';
            }

        } else if (!event.target.checked) {
            if (state == 'New') newState = true;
            if (state == 'Used') usedState = true;
            stateRepair = newState ? 'New' : 'Used';

            if (state == 'New' && this.used || state == 'Used' && this.new) {
                stateRepair = 'Any';
            }

        }
        await this.sellersService.updateStateRepair(stateRepair);
    }

}
