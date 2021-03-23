import {Injectable} from '@angular/core';
import {CacheService} from 'ionic-cache';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppCacheService {


    defaultTTl = 60 * 60 * 24 * 7;

    IMG_GROUP_KEY = 'IMG';

    constructor(
        private readonly cache: CacheService,
        private readonly sanitizer: DomSanitizer
    ) {
        this.cache.setDefaultTTL(this.defaultTTl);
        this.cache.clearExpired();

    }

    loadFromObservable<T>(cacheKey, request, groupKey, ttl): Observable<T> {
        return this.cache.loadFromObservable<T>(cacheKey, request, groupKey, ttl);
    }


    async cacheImageByUrl(url, key?) {

        key = key || url;


        try {
            return this.sanitizer.bypassSecurityTrustResourceUrl(await this.cache.getItem<string>(key));
        } catch (e) {
            const imgData = await this.createImageCache(key, url);
            return this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
        }
    }

    async cacheImageChat(localID, {data, url}: { url?, data? }) {


        try {
            return this.sanitizer.bypassSecurityTrustResourceUrl(await this.cache.getItem(localID));
        } catch (e) {
            if (data) {
                await this.cache.saveItem(localID, data, this.IMG_GROUP_KEY);
                return this.sanitizer.bypassSecurityTrustResourceUrl(await this.cache.getItem(localID));
            } else {
                return this.sanitizer.bypassSecurityTrustResourceUrl(await this.createImageCache(localID, url));
            }
        }


    }

    private async createImageCache(key, url) {
        const image = await this.convertImageToBase64(url);
        await this.cache.saveItem(key, image, this.IMG_GROUP_KEY);

        return await this.cache.getItem<string>(key);
    }

    private async convertImageToBase64(url): Promise<any> {
        const response = await fetch(url);
        const blob = await response.blob();
        const result = new Promise((resolve, reject) => {
            // if (blob.type === 'text/html' || blob.type === 'application/xml') {
            //     resolve(IMAGE_SETTINGS.NO_IMAGE);
            // } else {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject;
                reader.readAsDataURL(blob);
            // }
        });

        return await result;
    }
}
