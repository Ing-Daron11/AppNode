import { rentalService } from "../services/rental.service";
import { RentalModel, ComputerModel, UserModel } from "../models";
import { RentalInput } from "../interfaces";
import { ComputerStatus } from "../constants";
import mongoose from "mongoose";

// 🔹 Mockeamos los modelos de Mongoose
jest.mock("../models", () => ({
    RentalModel: {
        findOne: jest.fn(),
        find: jest.fn(() => ({
            populate: jest.fn().mockResolvedValue([
                { _id: "id1", computerId: "comp1", userId: "user1" },
                { _id: "id2", computerId: "comp2", userId: "user2" }
            ])
        })),
        findById: jest.fn(() => ({
            populate: jest.fn().mockResolvedValue({
                _id: "mockRentalId",
                computerId: "mockComputer",
                userId: "mockUser"
            })
        })),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
    ComputerModel: {
        findById: jest.fn(),
        save: jest.fn(),
    },
    UserModel: {
        findById: jest.fn(),
    }
}));

describe("🧪 RentalService - Pruebas Unitarias con Mocks", () => {

    //----------------------------------- Happy Tests ✅ -----------------------------------

    test("1️⃣ Crear un alquiler correctamente", async () => {
        const mockRentalInput: RentalInput = {
            computerId: new mongoose.Types.ObjectId().toString(),
            userId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            timeLimit: 24,
            initDate: new Date(),
            finalDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 día
        };

        // Mockeamos que la computadora y el usuario existen
        (ComputerModel.findById as jest.Mock).mockResolvedValue({ status: ComputerStatus.AVAILABLE });
        (UserModel.findById as jest.Mock).mockResolvedValue({ _id: mockRentalInput.userId });

        // Mockeamos la creación del alquiler
        (RentalModel.create as jest.Mock).mockResolvedValue({
            ...mockRentalInput,
            _id: "mockRentalId"
        });

        const rental = await rentalService.create(mockRentalInput);
        expect(rental).toHaveProperty("_id", "mockRentalId");
    });

    test("2️⃣ Obtener todos los alquileres", async () => {
        const rentals = await rentalService.findAll();

        expect(rentals.length).toBeGreaterThan(0);
        expect(rentals[0]).toHaveProperty("_id", "id1");
    });

    test("3️⃣ Obtener un alquiler por ID", async () => {
        const rental = await rentalService.getById("mockRentalId");

        expect(rental).toBeDefined();
        expect(rental?._id).toBe("mockRentalId");
    });

    test("4️⃣ Actualizar un alquiler correctamente", async () => {
        const updatedRental = { _id: "mockRentalId", timeLimit: 48 };

        (RentalModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedRental);
        const rental = await rentalService.update("mockRentalId", { timeLimit: 48 });

        expect(rental).toHaveProperty("timeLimit", 48);
    });

    test("5️⃣ Eliminar un alquiler correctamente", async () => {
        const deletedRental = { _id: "mockRentalId" };

        (RentalModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedRental);
        const rental = await rentalService.delete("mockRentalId");

        expect(rental).toHaveProperty("_id", "mockRentalId");
    });

    //----------------------------------- Sad Tests ❌ -----------------------------------

    test("6️⃣ No debe crear un alquiler si la computadora ya está rentada", async () => {
        (ComputerModel.findById as jest.Mock).mockResolvedValue({ status: ComputerStatus.RENTED });

        const rentalInput: RentalInput = {
            computerId: "mockComputerId",
            userId: "mockUserId",
            quantity: 1,
            timeLimit: 24,
            initDate: new Date(),
            finalDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 día
        };

        await expect(rentalService.create(rentalInput))
            .rejects.toThrow("Computer is already rented");
    });

    test("7️⃣ No debe obtener un alquiler si el ID no existe", async () => {
        (RentalModel.findById as jest.Mock).mockResolvedValue(null);
        const rental = await rentalService.getById("nonexistentId");

        expect(rental).toBeNull();
    });

    test("8️⃣ No debe actualizar un alquiler si el ID es inválido", async () => {
        await expect(rentalService.update("invalidId", { timeLimit: 24 }))
            .rejects.toThrow();
    });

    test("9️⃣ No debe eliminar un alquiler si el ID no existe", async () => {
        (RentalModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        const rental = await rentalService.delete("65f3a7bfcf1a4e2d9e8b4567");

        expect(rental).toBeNull();
    });

});
