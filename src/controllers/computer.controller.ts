import { Request, Response } from "express";
import { computerService } from "../services";
import { ComputerInput, ComputerInputUpdate } from "../interfaces";
import { ComputerCategory, ComputerStatus } from "../constants";

class ComputerController {
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const computerData: ComputerInput = req.body;

            // Validar que la categoría es válida
            if (!Object.values(ComputerCategory).includes(computerData.category)) {
                return res.status(400).json({
                    message: `Invalid category. Allowed values: ${Object.values(ComputerCategory).join(", ")}`,
                });
            }

            const computer = await computerService.create(computerData);
            return res.status(201).json(computer);
        } catch (error) {
            if (error instanceof ReferenceError) {
                return res.status(400).json({ message: "Computer already exists" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const computerController = new ComputerController();
