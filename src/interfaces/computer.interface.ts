import { ComputerCategory, ComputerStatus } from "../constants";

export interface ComputerInput {
    name: string;
    category: ComputerCategory;
    pricePerDay: number;
}

export interface ComputerInputUpdate {
    name?: string;
    category?: ComputerCategory;
    pricePerDay?: number;
    status?: ComputerStatus;
}

export interface ComputerResponse {
    id: string;
    name: string;
    category: ComputerCategory;
    pricePerDay: number;
    status: ComputerStatus;
}
