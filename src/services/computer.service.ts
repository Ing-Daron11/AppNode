import { ComputerDocument, ComputerModel } from "../models";
import { ComputerInput, ComputerInputUpdate, ComputerResponse } from "../interfaces";
import { ComputerStatus, ComputerCategory } from "../constants";

class ComputerService {

    public async create(computerInput: ComputerInput): Promise<ComputerDocument> {
        try {

            if(!computerInput.name || !computerInput.category || !computerInput.pricePerDay){
                throw new ReferenceError("All fields must be completed");
            }
            // Validar que la categoría sea un valor permitido en ComputerCategory
            if (!Object.values(ComputerCategory).includes(computerInput.category)) {
                throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`);
            }
            const computerExists: ComputerDocument | null = await ComputerModel.findOne({ name: computerInput.name });
            if (computerExists) {
                throw new ReferenceError("Computer already exists"); 
            }

            const computer: ComputerDocument = await ComputerModel.create(computerInput);
            return computer;
        } catch (error) {
            throw new Error ("Error creating computer "+error);
        }
    }

    public async findAll(): Promise<ComputerDocument[]> {
        try {
            return await ComputerModel.find();
        } catch (error) {
            throw new Error("Error finding all computers "+error); 
        }
    }

    public async getById(id: string): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findById(id);
            if (!computer) throw new Error("Computer not found");
            return computer.toObject() as ComputerDocument;
        } catch (error) {
            throw new Error(`Error finding computer by id ${id} ${error}`);
        }
    }

    public async getByName(name: string): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findOne({ name });
            if (!computer) throw new Error("Computer not found");
            return computer.toObject() as ComputerDocument;
        } catch (error) {
            throw new Error(`Error finding computer by name ${name} ${error}`);
        }
    }

    // falta revisar si funciona todo bien con la categoria con enums
    public async getByCategory(category: ComputerCategory): Promise<ComputerDocument[] | null> {
        try {
            if (!Object.values(ComputerCategory).includes(category)) {
                throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`);
            }
            const computers = await ComputerModel.find({ category });
            if (!computers.length) throw new Error("No computers found in this category");
            return computers;
        } catch (error) {
            throw new Error(`Error finding computers by category ${category} ${error}`);
        }
    }

    // también falta tener en cuenta los enums en constants.ts
    public async update(id: string, computerInput: ComputerInputUpdate): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findById(id);
            if (!computer) throw new Error("Computer not found");

            // Validar que la categoría sea válida si se está actualizando
            if (computerInput.category && !Object.values(ComputerCategory).includes(computerInput.category)) {
                throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`);
            }

            // No permitir cambiar estado a "available" si actualmente está alquilado
            if (computer.status === ComputerStatus.RENTED && computerInput.status === ComputerStatus.AVAILABLE) {
                throw new ReferenceError("Cannot change status to 'available' while computer is rented.");
            }

            const updatedComputer = await ComputerModel.findByIdAndUpdate(id, computerInput, { new: true });
            return updatedComputer;
        } catch (error) {
            throw new Error(`Error updating computer by id ${id} ${error}`);
        }
    }

    // también falta tener en cuenta los enums en constants
    public async updateStatus(id: string, status: ComputerStatus): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findById(id);
            if (!computer) throw new Error("Computer not found");

            // Validar que el estado sea válido
            if (!Object.values(ComputerStatus).includes(status)) {
                throw new ReferenceError(`Invalid status. Allowed values: ${Object.values(ComputerStatus).join(", ")}`);
            }

            // No permitir cambiar el estado de un computador alquilado
            if (computer.status === ComputerStatus.RENTED && status !== ComputerStatus.RENTED) {
                throw new ReferenceError("Cannot change status of a rented computer.");
            }

            computer.status = status;
            await computer.save();
            return computer;
        } catch (error) {
            throw new Error(`Error updating computer status by id ${id} ${error}`);
        }
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
            throw new Error(`Error deleting computer by id ${id} ${error}`);
        }
    }
}