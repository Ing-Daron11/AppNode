import app from '../index';
import request from 'supertest';


describe('User Endpoints', () => {

//----------------------------------- Happy Tests -----------------------------------
  describe(' Happy Tests', () => {
    
    test('1 Obtener todos los usuarios (Admin autorizado)', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer token_valido_admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBeTruthy();
    });

    test('2 Crear un usuario (Admin autorizado)', async () => {
      const newUser = {
        username: 'nuevoUsuario',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token_valido_admin')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
    });


    test('3 Iniciar sesión correctamente', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test("4 Actualizar usuario (Admin autorizado)", async () => {
      const response = await request(app)
        .put('/users/12345')
        .set('Authorization', 'Bearer token_valido_admin')
        .send({ username: 'actualizado' });
      
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('actualizado');
    });

    test('5 Eliminar usuario (Admin autorizado)', async () => {
      const response = await request(app)
        .delete('/users/12345')
        .set('Authorization', 'Bearer token_valido_admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario eliminado');
    });

  });

  //----------------------------------- Sad Tests -----------------------------------
  describe(' Sad Tests', () => {
    
    test('1 Obtener usuarios sin autenticación', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(401);
    });

    test('2 Crear usuario sin datos válidos', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token_valido_admin')
        .send({ username: '', email: 'mal', password: '123' });

      expect(response.status).toBe(400);
    });

    test('3 Obtener perfil sin token', async () => {
      const response = await request(app).get('/users/profile');
      expect(response.status).toBe(401);
    });

    test('4 Iniciar sesión con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'fake@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    test('5 Actualizar usuario sin permisos', async () => {
      const response = await request(app)
        .put('/users/12345')
        .set('Authorization', 'Bearer token_valido_usuario')
        .send({ username: 'intentandoActualizar' });

      expect(response.status).toBe(403);
    });

    test('6 Eliminar usuario inexistente', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .set('Authorization', 'Bearer token_valido_admin');

      expect(response.status).toBe(404);
    });

  });

});