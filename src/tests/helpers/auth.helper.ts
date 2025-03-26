import request from 'supertest';
import { app } from "../../index";

export const getAuthToken = async () => {
    const loginResponse = await request(app)
        .post('/user/login')
        .send({
            email: "david_Malte@gmail.com",
            password: "Malte123"
        });

    if (!loginResponse.body.user?.token) {
        console.log('Login Response:', loginResponse.body);
        throw new Error('Failed to get authentication token');
    }

    return loginResponse.body.user.token;
};