import { Request, Response } from "express";
import { computerService } from "../services";
import { ComputerInput, ComputerInputUpdate } from "../interfaces";
import { ComputerCategory, ComputerStatus } from "../constants";

class ComputerController {
    public async create(req: Request, res: Response): Promise<void> {
        try {

            const { name, category, pricePerDay } = req.body;

            const computerData: ComputerInput = { name, category, pricePerDay };

            // Validar que la categoría es válida
            if (!Object.values(ComputerCategory).includes(computerData.category)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
            }

            const computer = await computerService.create(computerData);
            res.status(201).json(computer);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: "Computer already exists" });
            }
            res.status(500).json({ message: "Internal server error"+error });
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
            }
            res.status(200).json(computer);
        } catch (error) {
            res.status(500).json({ message: "Internal server error " + error });
        }
    }

    public async getByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.params;
            if (!Object.values(ComputerCategory).includes(category as ComputerCategory)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
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
            const computerData: ComputerInputUpdate = req.body;

            // Validar que la categoría es válida
            if (computerData.category && !Object.values(ComputerCategory).includes(computerData.category)) {
                res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
            }

            const computer = await computerService.update(id, computerData);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
            }
            res.status(200).json(computer);
        }
        catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: error.message });
            }
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
            }

            const computer = await computerService.updateStatus(id, status as ComputerStatus);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
            }
            res.status(200).json(computer);
        }
        catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const computer = await computerService.delete(id);
            if (!computer) {
                res.status(404).json({ message: "Computer not found" });
            }
            res.status(200).json("Computer: "+computer+" deleted");
        }
        catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error: " + error });
        }
    }
}

export const computerController = new ComputerController();