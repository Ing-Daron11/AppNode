import request from 'supertest';
import { app } from "../index";
import { ComputerModel } from '../models';
import { ComputerCategory, ComputerStatus } from '../constants';
import mongoose from 'mongoose';
import { getAuthToken } from './helpers/auth.helper';

describe("📌 Computer API Tests", () => {
    let authToken: string = "";
    let availableComputerId: string = "";
    let rentedComputerId: string = "";

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/testdb");
        }
        await ComputerModel.deleteMany({});
        authToken = await getAuthToken();

        // Crear dos computadores para pruebas (uno disponible y uno rentado)
        const availableComputer = await ComputerModel.create({
            name: "MacBook Pro",
            category: ComputerCategory.OFFICE,
            status: ComputerStatus.AVAILABLE,
            pricePerDay: 30
        });

        const rentedComputer = await ComputerModel.create({
            name: "Alienware M15",
            category: ComputerCategory.GAMER,
            status: ComputerStatus.RENTED,
            pricePerDay: 50
        });

        availableComputerId = availableComputer.id.toString();
        rentedComputerId = rentedComputer.id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    /** ✅ HAPPY PATH - Pruebas con rutas correctas */
    test("✅ Crear un computador correctamente", async () => {
        const res = await request(app)
            .post("/computer")
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: "Dell XPS 15",
                category: ComputerCategory.DESIGN,
                pricePerDay: 40
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.name).toBe("Dell XPS 15");
    });

    test("✅ Obtener todos los computadores", async () => {
        const res = await request(app)
            .get("/computer")
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("✅ Obtener un computador por ID", async () => {
        const res = await request(app)
            .get(`/computer/${availableComputerId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", availableComputerId);
    });

    test("✅ Obtener computadores por categoría", async () => {
        const res = await request(app)
            .get(`/computer/category/${ComputerCategory.OFFICE}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test("✅ Actualizar un computador disponible", async () => {
        const res = await request(app)
            .put(`/computer/${availableComputerId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: "MacBook Air",
                category: ComputerCategory.DESIGN,
                pricePerDay: 35
            });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("MacBook Air");
    });

    test("✅ Cambiar estado de un computador disponible", async () => {
        const res = await request(app)
            .patch(`/computer/${availableComputerId}/status`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ status: ComputerStatus.RENTED });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(ComputerStatus.RENTED);
    });

    test("✅ Cambiar estado de un computador rentado", async () => {
        const res = await request(app)
            // avaliableComputerId es el ID de un computador que está rentado
            .patch(`/computer/${availableComputerId}/status`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ status: ComputerStatus.AVAILABLE });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(ComputerStatus.AVAILABLE);
    });

    test("✅ Eliminar un computador disponible", async () => {
        const res = await request(app)
            .delete(`/computer/${availableComputerId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
    });

    /** ❌ SAD PATH - Pruebas con errores y restricciones */
    test("❌ No se puede eliminar un computador RENTADO", async () => {
        const res = await request(app)
            .delete(`/computer/${rentedComputerId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Cannot delete a rented computer.");
    });

    test("❌ No se puede modificar un computador RENTADO", async () => {
        const res = await request(app)
            .put(`/computer/${rentedComputerId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: "Nuevo Nombre" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Cannot update a rented computer.");
    });


    test("❌ Intentar obtener un computador con un ID inexistente", async () => {
        const res = await request(app)
            .get(`/computer/000000000000000000000000`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Computer not found");
    });

    test("❌ Intentar obtener un computador con un ID inválido", async () => {
        const res = await request(app)
            .get(`/computer/invalid-id`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(500);
    });

    test("❌ Intentar crear un computador sin datos", async () => {
        const res = await request(app)
            .post(`/computer`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("All fields must be completed");
    });

    test("❌ Intentar crear un computador con una categoría inválida", async () => {
        const res = await request(app)
            .post(`/computer`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: "Laptop X", category: "InvalidCategory", pricePerDay: 40 });

        expect(res.status).toBe(400);
    });

    test("❌ Intentar actualizar un computador con un ID inválido", async () => {
        const res = await request(app)
            .put(`/computer/invalid-id`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: "Nuevo Nombre" });

        expect(res.status).toBe(500);
    });

});
