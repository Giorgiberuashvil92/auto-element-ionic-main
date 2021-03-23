export class AdModel {
    _id?: string;
    description: string;
    category: string;
    model: string;
    year: any;
    region: string;
    vin?: any;
    state: any;
    user: string;
    dateCreate: any;
    aliasCategory:string;

    active: boolean;
    archive: boolean;

    cnt?: any;

    constructor() {
    }
}
