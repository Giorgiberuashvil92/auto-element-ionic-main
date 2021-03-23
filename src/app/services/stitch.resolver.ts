import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {first} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class StitchResolver implements Resolve<Observable<string>> {
    constructor(private authService: AuthService) {}

    resolve() {
        return this.authService.getStitchAuth();
    }
}
