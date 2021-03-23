import {Component, OnInit, PipeTransform, Pipe} from '@angular/core';
import {AdsService} from "../../../services/ads.service";
import {AdModel} from "../../../models/ad.model";
import {MessagesService} from "../../../services/messages.service";
import {Observable} from "rxjs";
import {MessageModel} from "../../../models/message.model";
import {CoreService} from "../../../services/core.service";

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], term: string): any {
        let filterAds = {archive:false};
        if (term == 'archive'){
            filterAds.archive = true;
        }
        if (items)
        return items.filter((ad)=>{
            return ad.archive == filterAds.archive
        });
    }
}

@Component({
    selector: 'app-my-ads',
    templateUrl: './my-ads.page.html',
    styleUrls: ['./my-ads.page.scss'],
})
export class MyAdsPage implements OnInit {

    filter = 'active';
    myAds: any;

    trackByFn(index: number, item: AdModel) {
        return item._id.toString();
    }

    constructor(
        private adsService: AdsService,
        private messagesService: MessagesService,
        private coreService: CoreService
    ) {
    }

    ngOnInit() {
        this.coreService.currentRoute.subscribe((route)=>{
            if (route == '/tabs/myAds'){
                this.getMyAds();
            }
        });
    }

    ionViewDidEnter() {
    }

    getMyAds() {
        this.myAds = this.adsService.getMy();
        this.adsService.getMyCache();
    }

    getUnread(collection, id):Observable<MessageModel[]>{
        return this.messagesService.getUnreadItem(collection, id);
    }

    async doRefresh(event) {
        await this.getMyAds();
        setTimeout(() => {
            event.target.complete();
        }, 200);
    }

    segmentChanged(ev){
        this.filter = ev.detail.value;
    }

}
