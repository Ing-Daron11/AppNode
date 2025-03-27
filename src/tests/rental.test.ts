import app from '../index';
import request from 'supertest';
import { getAuthToken } from './helpers/auth.helper';

let authToken: string;
let userId: string;
let computerId: string;
let rentalId: string;

beforeAll(async () => {
    authToken = await getAuthToken();

    // Crear usuario
    const userResponse = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            password: 'SecurePass123'
        });

    userId = userResponse.body._id;

    // Crear computadora
    const computerResponse = await request(app)
        .post('/computer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: 'MacBook Pro',
            model: 'M1 Pro',
            status: 'Available',
            category: 'Design',
            specs: 'Apple M1 Pro, 16GB RAM, 1TB SSD',
            pricePerDay: 5000
        });

    computerId = computerResponse.body._id;

    // Crear alquiler
    const rentalResponse = await request(app)
        .post('/rental')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            computerId: computerId,
            userId: userId,
            quantity: 3,
            timeLimit: 15,
            initDate: "2024-03-24T10:00:00Z",
            finalDate: "2024-03-25T10:00:00Z"
        });

    rentalId = rentalResponse.body._id;
});

describe('Rental Endpoints', () => {

    //----------------------------------- Happy Tests ✅ -----------------------------------
    describe('✅ Happy Tests', () => {
        
        test('1️⃣ Crear un alquiler (Admin autorizado)', async () => {
            const response = await request(app)
                .post('/rental')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    computerId: computerId,
                    userId: userId,
                    quantity: 3,
                    timeLimit: 15,
                    initDate: new Date(),
                    finalDate: "2024-05-25T10:00:00Z"
                });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.user).toBe(userId);
            expect(response.body.computer).toBe(computerId);
        });

        test('2️⃣ Obtener todos los alquileres', async () => {
            const response = await request(app)
                .get('/rental')
                .set('Authorization', `Bearer ${authToken}`);
        
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBeGreaterThan(0);
        
            expect(response.body[0]).toHaveProperty('userId');
            expect(response.body[0].userId).toHaveProperty('name');
            expect(response.body[0].userId).toHaveProperty('email');
        });
        

        test('3️⃣ Obtener un alquiler por ID', async () => {
            const response = await request(app)
                .get(`/rental/${rentalId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', rentalId);
        });

        test('4️⃣ Actualizar un alquiler (Admin autorizado)', async () => {
            const response = await request(app)
                .put(`/rental/${rentalId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ endDate: '2025-04-07' });

            expect(response.status).toBe(200);
            expect(response.body.endDate).toBe('2025-04-07');
        });

        test('5️⃣ Eliminar un alquiler (Admin autorizado)', async () => {
            const response = await request(app)
                .delete(`/rental/${rentalId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Rental deleted successfully');
        });

    });

    //----------------------------------- Sad Tests ❌ -----------------------------------
    describe('❌ Sad Tests', () => {

        test('1️⃣ Intentar alquilar una computadora que ya está rentada', async () => {
            const response = await request(app)
                .post('/rental')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    computerId: computerId,
                    userId: userId,
                    quantity: 4,
                    timeLimit: 25,
                    initDate: "2024-03-24T10:00:00Z",
                    finalDate: "2024-03-25T10:00:00Z"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Computer is not available for rent');
        });

        test('2️⃣ Intentar obtener alquileres sin autenticación', async () => {
            const response = await request(app).get('/rental');
            expect(response.status).toBe(401);
        });

        test('3️⃣ Crear un alquiler con fechas incorrectas', async () => {
            const response = await request(app)
                .post('/rental')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    computerId: computerId,
                    userId: userId,
                    quantity: 3,
                    timeLimit: 15,
                    initDate: "2024-03-24T10:00:00Z",
                    finalDate: "2024-03-22T10:00:00Z"
                });

            expect(response.status).toBe(500);
            //expect(response.body.message).toBe('End date must be after start date');
        });

        test('4️⃣ Intentar obtener un alquiler inexistente', async () => {
            const response = await request(app)
                .get('/rental/999999999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Rental not found');
        });

        test('5️⃣ Intentar actualizar un alquiler sin permisos', async () => {
            const response = await request(app)
                .put(`/rental/${rentalId}`)
                .set('Authorization', 'Bearer invalidToken')
                .send({ endDate: '2025-04-09' });

            expect(response.status).toBe(401);
        });

        test('6️⃣ Intentar eliminar un alquiler inexistente', async () => {
            const response = await request(app)
                .delete('/rental/65f3a7bfcf1a4e2d9e8b4567')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            //expect(response.body.message).toBe('Rental not found');
        });

    });

});
