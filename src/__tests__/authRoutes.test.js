const request = require('supertest');
const app = require('../app');
const authService = require('../services/authService');

jest.mock('../services/authService');

describe('Auth Endpoints', () => {
    describe('POST /login', () => {
        it('should return a token when credentials are correct', async () => {
            const mockUser = { id: 1, username: 'testuser', type: 'user' };
            authService.login.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/login')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return 500 when login fails', async () => {
            authService.login.mockRejectedValue(new Error('Invalid credentials'));

            const response = await request(app)
                .post('/api/login')
                .send({ username: 'invaliduser', password: 'wrongpassword' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            authService.register.mockResolvedValue({ message: 'User registered successfully' });

            const response = await request(app)
                .post('/api/register')
                .send({ username: 'newuser', password: 'password123', type: 'user' });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should return 500 when registration fails', async () => {
            authService.register.mockRejectedValue(new Error('User already exists'));

            const response = await request(app)
                .post('/api/register')
                .send({ username: 'existinguser', password: 'password123', type: 'user' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'User already exists');
        });
    });
});
