import { ComputerDocument, ComputerModel } from "../models";
import { ComputerInput, ComputerInputUpdate } from "../interfaces";
import { ComputerStatus, ComputerCategory } from "../constants";

class ComputerService {
    public async create(computerInput: ComputerInput): Promise<ComputerDocument> {
        try {
            if (!computerInput.name || !computerInput.category || !computerInput.pricePerDay) {
                throw new ReferenceError("All fields must be completed");
            }
            // Validar que la categoría sea un valor permitido en ComputerCategory
            if (!Object.values(ComputerCategory).includes(computerInput.category)) {
                throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`);
            }
    
            const computerExists = await ComputerModel.findOne({ name: computerInput.name });
            if (computerExists) {
                throw new ReferenceError("Computer already exists");
            }
    
            return await ComputerModel.create(computerInput);
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
        
    }

    public async findAll(): Promise<ComputerDocument[]> {
        try {
            return await ComputerModel.find();
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
    }

    public async getById(id: string): Promise<ComputerDocument | null> {
        try {
            return await ComputerModel.findById(id);
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
    }

    public async getByName(name: string): Promise<ComputerDocument [] | null> {
        try {
            const computers = await ComputerModel.find({ name });
            return computers;
        } catch (error) {
            throw new Error(`Error finding computer by name ${name} ${error}`);
        }
    }

    public async getByCategory(category: ComputerCategory): Promise<ComputerDocument[]> {
        try {
            return await ComputerModel.find({ category });
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
    }

    public async update(id: string, computerInput: ComputerInputUpdate): Promise<ComputerDocument | null> {
        const computer = await ComputerModel.findById(id);
        if (!computer) throw new Error("Computer not found");

        if (computer.status === ComputerStatus.RENTED) {
            throw new ReferenceError("Cannot update a rented computer.");
        }

        return await ComputerModel.findByIdAndUpdate(id, computerInput, { new: true });
    }

    public async updateStatus(id: string, status: ComputerStatus): Promise<ComputerDocument | null> {
        const computer = await ComputerModel.findById(id);
        if (!computer) throw new Error("Computer not found");

        computer.status = status;
        await computer.save();
        return computer;
    }

    public async delete(id: string): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findById(id);
        if (!computer) throw new Error("Computer not found");

            // No permitir eliminar un computador alquilado
            if (computer.status === ComputerStatus.RENTED) {
            throw new ReferenceError("Cannot delete a rented computer.");
        }

        return await ComputerModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
        
    }
}

export const computerService = new ComputerService();
