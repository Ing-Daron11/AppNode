import mongoose from "mongoose";

export interface RentalDocument extends mongoose.Document {
    computerId: mongoose.Types.ObjectId; // Relación con Computer
    userId: mongoose.Types.ObjectId; // Relación con User
    quantity: number;
    timeLimit: number;
    initDate: Date;
    finalDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

const rentalSchema = new mongoose.Schema({
    computerId: { type: mongoose.Schema.Types.ObjectId, ref: "Computer", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true },
    timeLimit: { type: Number, required: true },
    initDate: { type: Date, required: true },
    finalDate: { type: Date, required: true },
}, { timestamps: true, collection: "rentals" });

export const RentalModel = mongoose.model<RentalDocument>("Rental", rentalSchema);
