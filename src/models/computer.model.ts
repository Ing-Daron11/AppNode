import mongoose from "mongoose";
import { ComputerCategory, ComputerStatus } from "../constants";

export interface ComputerDocument extends mongoose.Document {
    name: String;
    category: ComputerCategory;
    status: ComputerStatus;
    pricePerDay: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const computerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: Object.values(ComputerCategory), required: true },    
    status: { type: String, required: true, enum: Object.values(ComputerStatus), default: "available" },
    pricePerDay: { type: Number, required: true },
}, { timestamps: true, collection: "computers" });

export const ComputerModel = mongoose.model<ComputerDocument>("Computer", computerSchema);
