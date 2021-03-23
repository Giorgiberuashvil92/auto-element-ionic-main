import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {first} from "rxjs/operators";
import {AppCacheService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class TranslatesService {

    languages = [
        {name: 'Azerbaijan', code:'az'},
        {name: 'Georgia', code: 'ka'},
        {name: 'Kazakhstan', code: 'kk'},
        {name: 'Russia', code:'ru'},
        {name: 'Ukraine', code:'uk'},
        {name: 'Uzbekistan', code:'uz'},
    ];

    constructor(
        private translate: TranslateService,
        private storageService: AppCacheService
    ) {
        translate.addLangs(this.languages.map((lang) => lang.code));
    }

    async init() {
        const lang = await this.storageService.get('language');
        if (lang) {
            this.switchLang(lang);
        }
        else {
            const defaultLang = navigator.language.slice(0, 2).toLowerCase();
            if (this.translate.getLangs().includes(defaultLang)) {
                this.switchLang(defaultLang)
            } else {
                this.switchLang('en');
            }
        }
    }

    getWord(word, params?): string {
        if (!params) {
            return this.translate.instant(word);
        } else {
            return this.translate.instant(word,params);
        }
    }

    async getWordAsync(word): Promise<string> {
        return await this.translate.get(word).pipe(first()).toPromise();
    }

    async switchLang(lang: string) {
        this.translate.use(lang);
        return await this.storageService.set('language', lang);
    }

}
