import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppCacheService} from "./storage.service";


@Injectable({
    providedIn: 'root'
})
export class ClientGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: AppCacheService
    ) {
    }

    async canActivate(): Promise<boolean> {
        const roleApp = await this.storageService.get('roleApp');
        if (roleApp == 'client') {
            return true;
        } else {
            await this.router.navigate(['/tabs/allAds']);
            return false;
        }
    }

}
