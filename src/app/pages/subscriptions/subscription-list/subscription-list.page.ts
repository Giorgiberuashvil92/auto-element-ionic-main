import { Component, OnInit } from '@angular/core';
import {ReferencesService} from "../../../services/references.service";

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.page.html',
  styleUrls: ['./subscription-list.page.scss'],
})
export class SubscriptionListPage implements OnInit {

  trackByFn(index: number, item: any) {
    return item.name;
  }

  categoryList: any;

  constructor(private referencesService: ReferencesService) { }


  ngOnInit() {
    this.categoryList = this.referencesService.getAllCategories();
  }

}
