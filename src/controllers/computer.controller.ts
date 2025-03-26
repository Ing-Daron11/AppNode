import { Request, Response } from "express";
import { computerService } from "../services";
import { ComputerInput, ComputerInputUpdate } from "../interfaces";
import { ComputerCategory, ComputerStatus } from "../constants";

class ComputerController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, category, pricePerDay } = req.body;

            if (!name || !category || !pricePerDay) {
                res.status(400).json({ message: "All fields must be completed" });
                return;
            }
            // Validar que la categoría es válida

            if (!Object.values(ComputerCategory).includes(category as ComputerCategory)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
                return;
            }

            const computer = await computerService.create({ name, category, pricePerDay });
            res.status(201).json(computer);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const computers = await computerService.findAll();
            res.status(200).json(computers);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const computerId = req.params.id;
            const computer = await computerService.getById(computerId);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
                return;
            }
            res.status(200).json(computer);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async getByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.params;
            if (!Object.values(ComputerCategory).includes(category as ComputerCategory)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
                return;
            }
            const computers = await computerService.getByCategory(category as ComputerCategory);
            res.status(200).json(computers);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const existingComputer = await computerService.getById(id);

            if (!existingComputer) {
                res.status(404).json({ message: "Computer not found" });
                return;
            }
    
            if (existingComputer.status === ComputerStatus.RENTED) {
                res.status(400).json({ message: "Cannot update a rented computer." });
                return;
            }

            const computerData: ComputerInputUpdate = req.body;
            // Validar que la categoría es válida

            if (computerData.category && !Object.values(ComputerCategory).includes(computerData.category)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
                return;
            }

            if (computerData.status == ComputerStatus.RENTED) {
                res.status(400).json({ message: "Cannot update a rented computer." });
                return;
            }

            const computer = await computerService.update(id, computerData);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
                return;
            }
            res.status(200).json(computer);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            // Validar que el estado es válido

            if (!Object.values(ComputerStatus).includes(status as ComputerStatus)) {
                res.status(400).json({
                    message: `Invalid status. Allowed values: ${Object.values(ComputerStatus).join(", ")}`,
                });
                return;
            }

            const computer = await computerService.updateStatus(id, status as ComputerStatus);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
                return;
            }
            res.status(200).json(computer);
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const existingComputer = await computerService.getById(id);
            if (!existingComputer) {
                res.status(404).json({ message: "Computer not found" });
                return;
            }

            if (existingComputer.status === ComputerStatus.RENTED) {
                res.status(400).json({ message: "Cannot delete a rented computer." });
                return;
            }

            const computer = await computerService.delete(id);
            res.status(200).json({ message: "Computer deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }
}

export const computerController = new ComputerController();