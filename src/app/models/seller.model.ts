export class SellerModel {
    _id?: string;
    name: string;
    phone: string;
    description: string;
    address: string;
    region: string;
    city: any;
    uid: string;
    visible: boolean;
    state: any;
    rating: number;

    vip?: boolean;
    dateEnd?: any;

    constructor() {
    }
}
