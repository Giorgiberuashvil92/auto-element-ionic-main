import { Injectable } from '@angular/core';

import * as categories from '../../assets/categories.json';
import * as cities from '../../assets/cities.json';

import {AppCacheService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {

  private categories = categories['default'];
  private countries = cities['default'];

  constructor(private storageService: AppCacheService) { }

  getAllCategories() {
    return this.categories;
  }

  getByCategory(name) {
    return this.categories.filter((category) => category.name == name)[0];
  }

  async getAllRegions() {
    const lang = await this.storageService.get('language');
    return this.countries.filter((countries) => {
      return countries.country == lang
    });
  }

  async getCityByRegion(region) {
    return this.countries.filter((countries) => {
      return countries.name == region
    })[0].cities;
  }



}
