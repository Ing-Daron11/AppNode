import { Request, Response } from "express";
import mongoose from "mongoose";

import { rentalService } from "../services";
import { RentalInput, RentalInputUpdate } from "../interfaces";
import { ComputerModel, RentalDocument, RentalModel } from "../models";
import { ComputerStatus } from "../constants";

class RentalController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const rentalData: RentalInput = req.body;
    
            if (!rentalData || Object.keys(rentalData).length === 0) {
                res.status(400).json({ message: "Invalid rental data" });
                return;
            }
            console.log("Datos recibidos en el controlador:", rentalData);
            const rental = await rentalService.create(rentalData);
            res.status(201).json(rental);
        } catch (error) {
            RentalController.handleError(res, error); // Ya maneja el log internamente
        }
    }
    

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const rentals = await rentalService.findAll();
            res.status(200).json(rentals);
        } catch (error) {
            console.error("Error fetching rentals:", error);
            RentalController.handleError(res, error);
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log("ID recibido en el controlador:", id);

            // Validar si el ID es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid ID format" });
                return;
            }
    
            const rental = await rentalService.getById(id);
            if (!rental) {
                res.status(404).json({ message: "Rental not found" });
                
                return;
            }
    
            res.status(200).json(rental);
        } catch (error) {
            console.error("Error fetching rental by ID:", error);
            RentalController.handleError(res, error);
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const rentalData: RentalInputUpdate = req.body;

            if (!id || !rentalData || Object.keys(rentalData).length === 0) {
                res.status(400).json({ message: "Invalid request data" });
                return;
            }

            const rental = await rentalService.update(id, rentalData);
            if (!rental) {
                res.status(404).json({ message: "Rental not found" });
                return;
            }

            res.status(200).json(rental);
        } catch (error) {
            console.error("Error updating rental:", error);
            RentalController.handleError(res, error);
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
    
            const rental = await rentalService.delete(id);
            if (!rental || rental.id == null || rental.id != id) {
                res.status(404).json({ message: `Rental with id ${id} not found` });
                return;
            }
    
            res.status(200).json({ message: "Rental deleted successfully" });
        } catch (error) {
            console.error("Error deleting rental:", error);
            res.status(500).json({ message: "Internal server error", error: (error as Error).message });
        }
    }
    
    

    private static handleError(res: Response, error: unknown): void {
        if (error instanceof Error) {
            if (error.message.includes("Computer is already rented")) {
                res.status(409).json({ message: error.message });
                return;
            }
    
            if (error instanceof ReferenceError || error instanceof TypeError) {
                res.status(400).json({ message: error.message });
                return;
            }
    
            console.error("Unhandled error:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        } else {
            console.error("Unknown error:", error);
            res.status(500).json({ message: "Internal server error", error: String(error) });
        }
    }
    
    
    
    
}

export const rentalController = new RentalController();
