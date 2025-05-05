import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ComputerModel } from "../models/computer.model";
import { ComputerCategory, ComputerStatus } from "../constants";

describe("📌 ComputerModel Unit Tests", () => {
    let mongoServer: MongoMemoryServer;
    jest.setTimeout(60000);  
      
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await ComputerModel.deleteMany({});
    });

    test("✅ Crea un computador correctamente", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        const savedComputer = await computer.save();

        expect(savedComputer._id).toBeDefined();
        expect(savedComputer.name).toBe("MacBook Pro");
        expect(savedComputer.category).toBe(ComputerCategory.OFFICE);
        expect(savedComputer.status).toBe(ComputerStatus.AVAILABLE);
        expect(savedComputer.pricePerDay).toBe(40);
        expect(savedComputer.createdAt).toBeDefined();
        expect(savedComputer.updatedAt).toBeDefined();
    });

    test("❌ No permite guardar un computador sin nombre", async () => {
        const computer = new ComputerModel({
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        await expect(computer.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test("❌ No permite guardar un computador sin categoría", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        await expect(computer.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test("❌ No permite guardar un computador sin precio por día", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
        });

        await expect(computer.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test("❌ No permite una categoría inválida", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: "InvalidCategory",
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        await expect(computer.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test("❌ No permite un estado inválido", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: "InvalidStatus",
            pricePerDay: 40,
        });

        await expect(computer.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    test("✅ Guarda y actualiza correctamente la fecha de modificación (`updatedAt`)", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        const savedComputer = await computer.save();
        const initialUpdatedAt = savedComputer.updatedAt;

        // Simular una actualización después de 1 segundo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        savedComputer.name = "MacBook Air";
        const updatedComputer = await savedComputer.save();

        expect(updatedComputer.updatedAt).toBeDefined();
        expect(updatedComputer.updatedAt).not.toBe(initialUpdatedAt);
    });

    test("✅ Borra un computador correctamente", async () => {
        const computer = new ComputerModel({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 40,
        });

        const savedComputer = await computer.save();
        await ComputerModel.findByIdAndDelete(savedComputer._id);

        const deletedComputer = await ComputerModel.findById(savedComputer._id);
        expect(deletedComputer).toBeNull();
    });
});
