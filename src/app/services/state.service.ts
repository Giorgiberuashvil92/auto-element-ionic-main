import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    
    stateChanged: Subject<any> = new Subject();
    
    constructor() {

    }
}