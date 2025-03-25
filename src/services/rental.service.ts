import mongoose from "mongoose";
import { RentalDocument, RentalModel, ComputerModel, UserModel } from "../models";
import { RentalInput, RentalInputUpdate } from "../interfaces";
import { ComputerStatus } from "../constants";

class RentalService {
    public async create(rentalInput: RentalInput): Promise<RentalDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { userId, computerId, initDate, finalDate } = rentalInput;

            if (!userId || !computerId || !initDate || !finalDate) {
                throw new ReferenceError("All fields must be completed");
            }

            if (new Date(initDate) >= new Date(finalDate)) {
                throw new ReferenceError("Init date must be before final date");
            }

            const computer = await ComputerModel.findById(computerId).session(session);
            if (!computer) throw new ReferenceError("Computer not found");
            if (computer.status === ComputerStatus.RENTED) throw new ReferenceError("Computer is already rented");

            const user = await UserModel.findById(userId).session(session);
            if (!user) throw new ReferenceError("User not found");

            const rental = await RentalModel.create([{ ...rentalInput }], { session });

            computer.status = ComputerStatus.RENTED;
            await computer.save({ session });

            await session.commitTransaction();
            return rental[0];
        } catch (error) {
            await session.abortTransaction();
            throw new Error("Error creating rental: " + error);
        } finally {
            session.endSession();
        }
    }

    public async findAll(): Promise<RentalDocument[]> {
        try {
            return await RentalModel.find()
                .populate("userId", "name email")
                .populate("computerId", "name status");
        } catch (error) {
            throw new Error("Error finding all rentals: " + error);
        }
    }

    public async getById(id: string): Promise<RentalDocument | null> {
        try {
            const rental = await RentalModel.findById(id)
                .populate("userId", "name email")
                .populate("computerId", "name status");
            if (!rental) throw new Error("Rental not found");
            return rental;
        } catch (error) {
            throw new Error("Error finding rental by id " + id + " " + error);
        }
    }

    public async update(id: string, rentalInput: RentalInputUpdate): Promise<RentalDocument | null> {
        try {
            const rental = await RentalModel.findById(id);
            if (!rental) throw new Error("Rental not found");

            if (rentalInput.initDate && rentalInput.finalDate) {
                if (new Date(rentalInput.initDate) >= new Date(rentalInput.finalDate)) {
                    throw new ReferenceError("Init date must be before final date");
                }
            }

            return await RentalModel.findByIdAndUpdate(id, rentalInput, { new: true });
        } catch (error) {
            throw new Error("Error updating rental by id " + id + " " + error);
        }
    }

    public async delete(id: string): Promise<RentalDocument | null> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const rental = await RentalModel.findById(id).session(session);
            if (!rental) throw new Error("Rental not found");

            const computer = await ComputerModel.findById(rental.computerId).session(session);
            if (computer) {
                computer.status = ComputerStatus.AVAILABLE;
                await computer.save({ session });
            }

            const deletedRental = await RentalModel.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            return deletedRental;
        } catch (error) {
            await session.abortTransaction();
            throw new Error("Error deleting rental by id " + id + " " + error);
        } finally {
            session.endSession();
        }
    }
}

export const rentalService = new RentalService();
