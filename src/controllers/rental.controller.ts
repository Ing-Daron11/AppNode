import { Request, Response } from "express";
import { rentalService } from "../services";
import { RentalInput, RentalInputUpdate } from "../interfaces";

class RentalController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const rentalData: RentalInput = req.body;
            const rental = await rentalService.create(rentalData);
            res.status(201).json(rental);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: "Rental already exists" });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const rentals = await rentalService.findAll();
            res.status(200).json(rentals);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const rental = await rentalService.getById(id);
            if (!rental) {
                res.status(404).json({ message: "Rental not found" });
                return;
            }
            res.status(200).json(rental);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const rentalData: RentalInputUpdate = req.body;
            const rental = await rentalService.update(id, rentalData);
            if (!rental) {
                res.status(404).json({ message: "Rental not found" });
                return;
            }
            res.status(200).json(rental);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const rental = await rentalService.delete(id);
            if (!rental) {
                res.status(404).json({ message: "Rental not found" });
                return;
            }
            res.status(200).json({ message: "Rental deleted successfully" });
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const rentalController = new RentalController();
