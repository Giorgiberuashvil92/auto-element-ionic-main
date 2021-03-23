import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppCacheService} from "./storage.service";


@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: AppCacheService
    ) {
    }

    async canActivate(): Promise<boolean> {
        const roleApp = await this.storageService.get('roleApp');
        const lang = await this.storageService.get('language');
        if (!roleApp || !lang || lang == 'en') {
            await this.router.navigate(['/languages']);
            return false;
        } else {
            return true;
        }
    }

}
