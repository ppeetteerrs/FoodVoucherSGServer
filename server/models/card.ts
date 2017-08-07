export interface CardIn {
    ownerName: string;
    ownerLocation: string;
    quotaPerMonth: string;
    quotaPerDay: string;
    enabled: boolean;
}

export interface CardOut {
    charityName: string;
    charityID: string;
    creatorName: string;
    creatorID: string;
    ownerName: string;
    ownerLocation: string;
    quotaPerMonth: number;
    quotaPerDay: number;
    redeemedToday: number;
    redeemedThisMonth: number;
    batchUID: string;
    enabled: boolean;
    barcode: number;
    id?: string
}