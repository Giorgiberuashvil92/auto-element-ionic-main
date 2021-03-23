import {Injectable} from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        public authService: AuthService,
        private router: Router
    ) {
    }

    async canActivate(): Promise<boolean> {
        const user = await this.authService.getCurrentAuth();
        if (user) {
            return true;
        } else {
            await this.router.navigate(['/auth']);
            return false;
        }
    }
}