export class MessageModel {
    _id?: string;
    ad: string;
    offer: string;
    from: string;
    to: string;
    text: string;
    dateCreate: any;
    isRead?: boolean;

    img?: boolean;

    constructor() {
    }
}
