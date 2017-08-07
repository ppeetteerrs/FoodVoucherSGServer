export interface CardsBatchIn {
    charityID: string;
    creatorID: string;
    createdAt: Date;
    amount: string;
    quotaPerMonth: string;
    quotaPerDay: string;
}

export interface CardsBatchOut {
    charityName: string;
    charityEmail: string;
    creatorName: string;
    charityID: string;
    creatorID: string;
    createdAt: Date;
    amount: number;
    quotaPerMonth: number;
    quotaPerDay: number;
    id?: string
}