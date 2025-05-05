export interface RentalInput {
    computerId: string; // ObjectId de Computer
    userId: string; // ObjectId de User
    quantity: number;
    timeLimit: number;
    initDate: Date;
    finalDate: Date;
}

export interface RentalInputUpdate {
    computerId?: string;
    userId?: string;
    quantity?: number;
    timeLimit?: number;
    initDate?: Date;
    finalDate?: Date;
    deletedAt?: Date;
}

export interface RentalResponse {
    id: string;
    computerId: string;
    userId: string;
    quantity: number;
    timeLimit: number;
    initDate: Date;
    finalDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
