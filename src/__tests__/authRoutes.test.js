const authController = require('../controllers/authController');
const authService = require('../services/authService');

jest.mock('../services/authService');

describe('AuthController Endpoints', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    test('🔹 Should handle successful login', async () => {
        req.body = { username: 'testUser', password: 'password123' };
        authService.login.mockResolvedValue({ id: 1, username: 'testUser', type: 'user' });

        await authController.loginUser(req, res);

        expect(authService.login).toHaveBeenCalledWith('testUser', 'password123');
        expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'testUser', type: 'user' });
    });

    test('❌ Should handle failed login due to invalid credentials', async () => {
        req.body = { username: 'testUser', password: 'wrongPassword' };
        authService.login.mockRejectedValue({ statusCode: 401, message: 'Invalid credentials' });

        await authController.loginUser(req, res);

        expect(authService.login).toHaveBeenCalledWith('testUser', 'wrongPassword');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    test('Should handle successful user registration', async () => {
        req.body = { username: 'newUser', password: 'password123', type: 'user' };
        authService.register.mockResolvedValue({ message: 'User registered successfully' });

        await authController.registerUser(req, res);

        expect(authService.register).toHaveBeenCalledWith('newUser', 'password123', 'user');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    test('❌ Should handle registration failure due to existing user', async () => {
        req.body = { username: 'existingUser', password: 'password123', type: 'user' };
        authService.register.mockRejectedValue({ statusCode: 409, message: 'User already exists' });

        await authController.registerUser(req, res);

        expect(authService.register).toHaveBeenCalledWith('existingUser', 'password123', 'user');
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
});
