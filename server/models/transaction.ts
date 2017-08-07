export interface TransactionIn {
    hawkerID: string;
    hawkerName: string;
    cardID: string;
    cardBarcode: number;
    charityID: string;
    charityName: string;
    ownerName: string;
    ownerLocation: string;
    date: Date
}

export interface TransactionOut {
    hawkerID: string;
    hawkerName: string;
    cardID: string;
    cardBarcode: number;
    charityID: string;
    charityName: string;
    ownerName: string;
    ownerLocation: string;
    date: Date;
    id?: string
}