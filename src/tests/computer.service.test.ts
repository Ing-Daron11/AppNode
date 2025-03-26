import { ComputerModel } from "../models/computer.model";
import { computerService } from "../services/computer.service";
import { ComputerCategory, ComputerStatus } from "../constants";
import { ComputerDocument } from "../models";
import mongoose from "mongoose";

jest.mock("../models/computer.model");

describe("📌 ComputerService Unit Tests", () => {
    
    const mockComputer: Partial<ComputerDocument> = {
        id: new mongoose.Types.ObjectId(),
        name: "Test Computer",
        category: ComputerCategory.OFFICE,
        status: ComputerStatus.AVAILABLE,
        pricePerDay: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("✅ create() - Crea un computador correctamente", async () => {
        (ComputerModel.findOne as jest.Mock).mockResolvedValue(null);
        (ComputerModel.create as jest.Mock).mockResolvedValue(mockComputer);

        const result = await computerService.create({
            name: "Test Computer",
            category: ComputerCategory.OFFICE,
            pricePerDay: 20,
        });

        expect(result).toEqual(mockComputer);
        expect(ComputerModel.findOne).toHaveBeenCalledWith({ name: "Test Computer" });
        expect(ComputerModel.create).toHaveBeenCalledWith({
            name: "Test Computer",
            category: ComputerCategory.OFFICE,
            pricePerDay: 20,
        });
    });

    test("❌ create() - No permite crear un computador con nombre duplicado", async () => {
        (ComputerModel.findOne as jest.Mock).mockResolvedValue(mockComputer);

        await expect(
            computerService.create({
                name: "Test Computer",
                category: ComputerCategory.OFFICE,
                pricePerDay: 20,
            })
        ).rejects.toThrow("Computer already exists");
    });

    test("✅ findAll() - Obtiene todos los computadores", async () => {
        (ComputerModel.find as jest.Mock).mockResolvedValue([mockComputer]);

        const result = await computerService.findAll();
        expect(result).toEqual([mockComputer]);
        expect(ComputerModel.find).toHaveBeenCalled();
    });

    test("✅ getById() - Obtiene un computador por ID", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue(mockComputer);

        const result = await computerService.getById(mockComputer.id.toString());
        expect(result).toEqual(mockComputer);
        expect(ComputerModel.findById).toHaveBeenCalledWith(mockComputer.id.toString());
    });

    test("❌ getById() - Retorna error si el computador no existe", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(computerService.getById("invalid_id")).rejects.toThrow("Computer not found");
    });

    test("✅ update() - Actualiza un computador correctamente", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue(mockComputer);
        (ComputerModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockComputer, name: "Updated Name" });

        const result = await computerService.update(mockComputer.id.toString(), { name: "Updated Name" });

        expect(result).toHaveProperty("name", "Updated Name");
        expect(ComputerModel.findById).toHaveBeenCalledWith(mockComputer.id.toString());
        expect(ComputerModel.findByIdAndUpdate).toHaveBeenCalledWith(
            mockComputer.id.toString(),
            { name: "Updated Name" },
            { new: true }
        );
    });

    test("❌ update() - No permite modificar un computador RENTADO", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue({
            ...mockComputer,
            status: ComputerStatus.RENTED,
        });

        await expect(
            computerService.update(mockComputer.id.toString(), { name: "New Name" })
        ).rejects.toThrow("Cannot update a rented computer.");
    });

    test("✅ delete() - Elimina un computador disponible", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue(mockComputer);
        (ComputerModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockComputer);

        const result = await computerService.delete(mockComputer.id.toString());
        expect(result).toEqual(mockComputer);
    });

    test("❌ delete() - No permite eliminar un computador RENTADO", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue({
            ...mockComputer,
            status: ComputerStatus.RENTED,
        });

        await expect(computerService.delete(mockComputer.id.toString())).rejects.toThrow(
            "Cannot delete a rented computer."
        );
    });
});
