import app from '../index';
import request from 'supertest';
import { getAuthToken } from './helpers/auth.helper';

let authToken: string; // Aquí almacenamos el token
let userId: string; // Aquí almacenamos el id del usuario creado
let complement: number = new Date().getTime();

beforeAll(async () => {
    authToken = await getAuthToken(); // Obtenemos el token antes de ejecutar los tests
});

describe('User Endpoints', () => {

  //----------------------------------- Happy Tests -----------------------------------
  describe('Happy Tests', () => {

    test('1 Crear un usuario (Admin autorizado)', async () => {
      const newUser = {
        name: 'Nuevo Usuario',
        email: `test${complement}@example.com`, // Email único
        password: 'password123',
        role: 'USER'
      };

      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${authToken}`) // Necesita un token de admin
        .send(newUser);

      

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      userId = response.body._id;
      console.log("Response Create User:", response.body);
    });

    test('2 Iniciar sesión con el usuario creado', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: `test${complement}@example.com`,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user.token');
    });

    test('3 Obtener todos los usuarios (Admin autorizado)', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${authToken}`);

        console.log("Response Get Users:", response.body);


      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('4 Actualizar usuario (Admin autorizado)', async () => {
        const response = await request(app)
            .put(`/user/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Usuario Actualizado',
                email: `test${complement}@example.com`, // Asegurar un email válido
                password: "password123", // Enviar la contraseña si es requerida
                role: "USER" // Asegurar que se mantiene el rol
            });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', userId);
    });

    test('5 Eliminar usuario (Admin autorizado)', async () => {
      const response = await request(app)
        .delete(`/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', userId);
    });

  });
});

  //----------------------------------- Sad Tests -----------------------------------
  describe(' Sad Tests', () => {
    
    test('1 Obtener usuarios sin autenticación', async () => {
      const response = await request(app).get('/user');
      expect(response.status).toBe(401);
    });

    test('2 Crear usuario sin datos válidos', async () => {
      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '', email: 'mal', password: '123' });

      expect(response.status).toBe(400);
    });

    test('3 Obtener perfil sin token', async () => {
      const response = await request(app).get('/user/profile');
      expect(response.status).toBe(401);
    });

    test('4 Iniciar sesión con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ email: 'fake@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    test('5 Actualizar usuario sin permisos', async () => {
      const response = await request(app)
        .put('/user/12345678912345678912345') //24 caracteres maneja mongo
        .set('Authorization', 'Bearer token_valido_usuario')
        .send({ name: 'intentandoActualizar' });

      expect(response.status).toBe(401); // No autorizado
    });

    test('6 Eliminar usuario inexistente', async () => {
      const response = await request(app)
        .delete('/user/') //24 caracteres maneja mongo
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404); // No encontrado
    });

  });

