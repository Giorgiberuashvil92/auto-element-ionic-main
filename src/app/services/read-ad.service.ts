import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReadAdService {

    key = 'readAds';

    constructor() {
    }

    saveItem(id: any) {
        let array: any = localStorage.getItem(this.key);
        if (array) array = JSON.parse(array);
        else array = [];
        array.push(id);
        let uniqueItems = Array.from(new Set(array));
        localStorage.setItem(this.key, JSON.stringify(uniqueItems));
    }

    getItem(id: any) {
        let array: any = localStorage.getItem(this.key);
        if (array) array = JSON.parse(array);
        else array = [];

        if (array.length == 0) {
            return false;
        }
        else {
            return array.indexOf(id) !== -1;
        }


    }

}
