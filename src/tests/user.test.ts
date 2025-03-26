import app from '../index';
import request from 'supertest';
import { getAuthToken } from './helpers/auth.helper';

let authToken: string; // Aquí almacenamos el token

beforeAll(async () => {
    authToken = await getAuthToken(); // Obtenemos el token antes de ejecutar los tests
});

describe('User Endpoints', () => {

  //----------------------------------- Happy Tests -----------------------------------
  describe('✅ Happy Tests', () => {
    
    test('1️⃣ Obtener todos los usuarios (Admin autorizado)', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${authToken}`); 
        expect(Array.isArray(response.body)).toBeTruthy(); 
        expect(response.body.length).toBeGreaterThan(0); 
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("email");
        expect(response.body[0]).toHaveProperty("role");
    });

    test('2️⃣ Crear un usuario (Admin autorizado)', async () => {
      const newUser = {
        name: 'nuevoUsuario',
        email: 'test@example.com',
        password: 'password123',
        role: 'USER'
      };

      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser);

        
        expect(response.status).toBe(201);
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("email");
        expect(response.body[0]).toHaveProperty("role");

    });

    test('3️⃣ Iniciar sesión correctamente', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test("4️⃣ Actualizar usuario (Admin autorizado)", async () => {
      const response = await request(app)
        .put('/user/12345')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'actualizado' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('actualizado');
    });

    test('5️⃣ Eliminar usuario (Admin autorizado)', async () => {
      const response = await request(app)
        .delete('/user/12345')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario eliminado');
    });

  });

  //----------------------------------- Sad Tests -----------------------------------
  describe('❌ Sad Tests', () => {
    
    test('1️⃣ Obtener usuarios sin autenticación', async () => {
      const response = await request(app).get('/user');
      expect(response.status).toBe(401);
    });

    test('2️⃣ Crear usuario sin datos válidos', async () => {
      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '', email: 'mal', password: '123' });

      expect(response.status).toBe(400);
    });

    test('3️⃣ Obtener perfil sin token', async () => {
      const response = await request(app).get('/user/profile');
      expect(response.status).toBe(401);
    });

    test('4️⃣ Iniciar sesión con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ email: 'fake@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    test('5️⃣ Actualizar usuario sin permisos', async () => {
      const response = await request(app)
        .put('/user/12345')
        .set('Authorization', 'Bearer token_valido_usuario')
        .send({ name: 'intentandoActualizar' });

      expect(response.status).toBe(403);
    });

    test('6️⃣ Eliminar usuario inexistente', async () => {
      const response = await request(app)
        .delete('/user/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

  });

});
