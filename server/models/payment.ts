export interface Payment {
    from_id: string;
    from_name: string;
    to_id: string;
    to_name: string;
    type: string;
    amount: number;
    confirmed: boolean;
    rejected: boolean;
    date: Date;
    id?: string
}