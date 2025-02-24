const request = require('supertest');
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const appointmentService = require('../services/appointmentService');
const { authenticateToken } = require('../middlewares/authMiddleware');

jest.mock('../services/appointmentService');
jest.mock('../middlewares/authMiddleware');

const app = express();
app.use(express.json());

authenticateToken.mockImplementation((req, res, next) => {
    req.user = { id: 'testUserId' };
    next();
});

app.get('/user/schedule', authenticateToken, appointmentController.getAppointments);

describe('GET /user/schedule', () => {
    let req, res;

    beforeEach(() => {
        req = { user: { id: 'testUserId' } };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });

    test('🔹 Should fetch user appointments successfully', async () => {
        const mockAppointments = { status: 200, data: ['appointment1', 'appointment2'] };
        appointmentService.getAppointmentsByUserId.mockResolvedValue(mockAppointments);

        await request(app)
            .get('/user/schedule')
            .set('Authorization', 'Bearer testToken')
            .expect(200)
            .then((response) => {
                expect(appointmentService.getAppointmentsByUserId).toHaveBeenCalledWith('testUserId');
                expect(response.body).toEqual(mockAppointments);
            });
    }, 10000);

    test('❌ Should handle error when fetching user appointments', async () => {
        appointmentService.getAppointmentsByUserId.mockRejectedValue(new Error('Error fetching appointments'));

        await request(app)
            .get('/user/schedule')
            .set('Authorization', 'Bearer testToken')
            .expect(500)
            .then((response) => {
                expect(response.body).toEqual({ message: 'Server error' });
            });
    }, 10000);
});
