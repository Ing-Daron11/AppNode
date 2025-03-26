import request from "supertest";
import app from "../index"; // Asegúrate de importar correctamente tu aplicación
import mongoose from "mongoose";

describe("Rental API Tests", () => {
    let rentalId: string;
    let token: string = "Bearer TU_TOKEN_AQUI"; // Reemplázalo con un token válido

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_URL!);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    // ✅ 1. Prueba para crear un Rental
    test("POST /rentals - Should create a rental", async () => {
        const res = await request(app)
            .post("/rentals")
            .set("Authorization", token)
            .send({
                userId: "67e31739abcbc14dfd00000f",
                computerId: "67e321c475e31ac6238b84f3",
                quantity: 1,
                timeLimit: 10,
                initDate: "2024-03-24T10:00:00Z",
                finalDate: "2024-03-25T10:00:00Z"
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("rental");
        rentalId = res.body.rental._id;
    });

    // ✅ 2. Prueba para obtener un Rental
    test("GET /rentals/:id - Should return a rental", async () => {
        const res = await request(app)
            .get(`/rentals/${rentalId}`)
            .set("Authorization", token);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", rentalId);
    });

    // ✅ 3. Prueba para actualizar un Rental
    test("PUT /rentals/:id - Should update a rental", async () => {
        const res = await request(app)
            .put(`/rentals/${rentalId}`)
            .set("Authorization", token)
            .send({ quantity: 2 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Rental updated successfully");
    });

    // ❌ 4. Prueba de error al actualizar un Rental inexistente
    test("PUT /rentals/:id - Should return 404 for non-existent rental", async () => {
        const res = await request(app)
            .put(`/rentals/65f4c1e3a8bce1a2b3c45678`)
            .set("Authorization", token)
            .send({ quantity: 2 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Rental not found");
    });

    // ✅ 5. Prueba para eliminar un Rental
    test("DELETE /rentals/:id - Should delete a rental", async () => {
        const res = await request(app)
            .delete(`/rentals/${rentalId}`)
            .set("Authorization", token);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Rental deleted successfully");
    });

    // ❌ 6. Prueba para eliminar un Rental inexistente
    test("DELETE /rentals/:id - Should return 404 for non-existent rental", async () => {
        const res = await request(app)
            .delete(`/rentals/65f4c1e3a8bce1a2b3c45678`)
            .set("Authorization", token);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Rental not found");
    });

    // ❌ 7. Prueba sin token (401 Unauthorized)
    test("GET /rentals/:id - Should return 401 when no token is provided", async () => {
        const res = await request(app).get(`/rentals/${rentalId}`);

        expect(res.status).toBe(401);
        expect(res.body).toEqual("Not Authorized");
    });
});
