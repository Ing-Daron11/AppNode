import { ComputerDocument, ComputerModel } from "../models";
import { ComputerInput, ComputerInputUpdate } from "../interfaces";

class ComputerService {

    public async create(computerInput: ComputerInput): Promise<ComputerDocument> {
        try {

            if(!computerInput.name || !computerInput.category || !computerInput.pricePerDay){
                throw new ReferenceError("All fields must be completed");
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

    // Falta tener en cuenta los enums en constants.ts
    public async getByCategory(category: string): Promise<ComputerDocument[] | null> {
        try {
            const computers = await ComputerModel.find({ category });
            if (!computers) throw new Error("Computers not found");
            return computers;
        } catch (error) {
            throw new Error(`Error finding computers by category ${category} ${error}`);
        }
    }

    // también falta tener en cuenta los enums en constants.ts
    public async update(id: string, computerInput: ComputerInputUpdate): Promise<ComputerDocument | null> {
        try {
            const computer: ComputerDocument | null = await ComputerModel.findByIdAndUpdate(
                {_id: id}, 
                computerInput, 
                { new: true });
            if (!computer) throw new Error("Computer not found");
            return computer;
        } catch (error) {
            throw new Error(`Error updating computer by id ${id} ${error}`);
        }
    }

    // también falta tener en cuenta los enums en constants
    public async updateStatus(id: string, status: string): Promise<ComputerDocument | null> {
        try {
            const computer: ComputerDocument | null = await ComputerModel.findByIdAndUpdate(
                {_id: id},  
                { status }, 
                { new: true });
            if (!computer) throw new Error("Computer not found");
            return computer;
        } catch (error) {
            throw new Error(`Error updating computer status by id ${id} ${error}`);
        }
    }

    public async delete(id: string): Promise<ComputerDocument | null> {
        try {
            const computer = await ComputerModel.findByIdAndDelete(id);
            if (!computer) throw new Error("Computer not found");
            return computer;
        } catch (error) {
            throw new Error(`Error deleting computer by id ${id} ${error}`);
        }
    }



}