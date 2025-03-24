export interface RentalInput {
    device: string; // ObjectId de Computer
    user: string; // ObjectId de User
    quantity: number;
    timeLimit: number;
    initDate: Date;
    finalDate: Date;
}

export interface RentalInputUpdate {
    device?: string;
    user?: string;
    quantity?: number;
    timeLimit?: number;
    initDate?: Date;
    finalDate?: Date;
    deletedAt?: Date;
}

export interface RentalResponse {
    id: string;
    device: string;
    user: string;
    quantity: number;
    timeLimit: number;
    initDate: Date;
    finalDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
