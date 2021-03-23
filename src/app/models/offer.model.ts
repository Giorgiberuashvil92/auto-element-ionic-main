import {SellerModel} from "./seller.model";

export class OfferModel {
    _id?: string;
    ad: string;
    user: string;
    text: string;
    price: string;
    img: Array<string>;
    dateCreate: any;
    messages: Array<any>;
    userInfo?: SellerModel;

    vip?: boolean;
    dateEnd?: any;
    not_available?: boolean;

    constructor() {
    }
}
