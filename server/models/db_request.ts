export interface DBGetAllRequest {
    db: string;
    table: string;
    index: string;
    valueIsInt: boolean;
    value;
    limit: number;
}

export interface DBUpdateRequest {
    type: string;
    id: string;
    object: any;
}

export interface DBInsertRequest {
    table: string;
    object: any;
}