import mongoose from "mongoose";
import { RentalDocument, RentalModel, ComputerModel, UserModel } from "../models";
import { RentalInput, RentalInputUpdate } from "../interfaces";
import { ComputerStatus } from "../constants";

class RentalService {
    public async create(rentalInput: RentalInput): Promise<RentalDocument> {
        const session = await mongoose.startSession();
        try {
            return await session.withTransaction(async () => {
                const { userId, computerId, initDate, finalDate } = rentalInput;

                if (!userId || !computerId || !initDate || !finalDate) {
                    throw new ReferenceError("All fields must be completed");
                }

                const init = new Date(initDate);
                const final = new Date(finalDate);

                if (isNaN(init.getTime()) || isNaN(final.getTime())) {
                    throw new ReferenceError("Invalid date format");
                }

                if (init >= final) {
                    throw new ReferenceError("Init date must be before final date");
                }

                const [computer, user] = await Promise.all([
                    ComputerModel.findById(computerId).session(session),
                    UserModel.findById(userId).session(session)
                ]);

                if (!computer) throw new ReferenceError("Computer not found");
                if (!user) throw new ReferenceError("User not found");

                if (computer.status === ComputerStatus.RENTED) {
                    throw new ReferenceError("Computer is already rented");
                }

                const rental = new RentalModel(rentalInput);
                await rental.save({ session });

                computer.status = ComputerStatus.RENTED;
                await computer.save({ session });

                return rental;
            });
        } catch (error) {
            throw new Error("Error creating rental: " + (error as Error).message);
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
            throw new Error("Error finding all rentals: " + (error as Error).message);
        }
    }

    public async getById(id: string): Promise<RentalDocument | null> {
        console.log("Buscando alquiler con ID:", id);
        try {
            const rental = await RentalModel.findById(id)
                .populate("userId", "name email")
                .populate("computerId", "name status");
    
            if (!rental) {
                console.error(`No se encontró un alquiler con el ID: ${id}`);
            } else {
                console.log("Alquiler encontrado:", rental);
            }
    
            return rental;
        } catch (error) {
            console.error(`Error buscando alquiler con ID: ${id} -`, error);
            throw new Error("Error finding rental by id: " + id);
        }
    }
    
    
    

    public async update(id: string, rentalInput: RentalInputUpdate): Promise<RentalDocument | null> {
        try {
            const rental = await RentalModel.findById(id);
            if (!rental) throw new ReferenceError("Rental not found");

            if (rentalInput.initDate || rentalInput.finalDate) {
                const init = rentalInput.initDate ? new Date(rentalInput.initDate) : rental.initDate;
                const final = rentalInput.finalDate ? new Date(rentalInput.finalDate) : rental.finalDate;

                if (init >= final) {
                    throw new ReferenceError("Init date must be before final date");
                }
            }

            return await RentalModel.findByIdAndUpdate(id, rentalInput, { new: true });
        } catch (error) {
            throw new Error("Error updating rental by id " + id + ": " + (error as Error).message);
        }
    }

    public async delete(id: string): Promise<RentalDocument | null> {
        const session = await mongoose.startSession();
        try {
            return await session.withTransaction(async () => {
                const rental = await RentalModel.findById(id).session(session);
                if (!rental) throw new ReferenceError("Rental not found");

                const computer = await ComputerModel.findById(rental.computerId).session(session);
                if (computer) {
                    computer.status = ComputerStatus.AVAILABLE;
                    await computer.save({ session });
                }

                return await RentalModel.findByIdAndDelete(id, { session });
            });
        } catch (error) {
            throw new Error("Error deleting rental by id " + id + ": " + (error as Error).message);
        } finally {
            session.endSession();
        }
    }
}

export const rentalService = new RentalService();
