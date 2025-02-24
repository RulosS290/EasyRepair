const request = require('supertest');
const app = require('../app');
const adminService = require('../services/adminService');

jest.mock('../services/adminService');

const adminToken = 'valid_admin_token';
const userToken = 'valid_user_token';

jest.mock('../middlewares/authMiddleware', () => ({
    authenticateToken: (req, res, next) => {
        req.user = req.headers.authorization === `Bearer ${adminToken}`
        ? { id: 1, username: 'admin', type: 'admin' }
        : { id: 2, username: 'user', type: 'user' };
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.user.type !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
        }
        next();
    }
    }));

    describe('Admin Endpoints', () => {
    describe('GET /admin/profiles', () => {
        it('should return a list of users when accessed by an admin', async () => {
        const mockUsers = [
            { id: 1, username: 'admin', type: 'admin' },
            { id: 2, username: 'user1', type: 'user' }
        ];
        adminService.getAllUsers.mockResolvedValue(mockUsers);

        const response = await request(app)
            .get('/api/admin/profiles')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        });

        it('should return 403 if accessed by a non-admin user', async () => {
        const response = await request(app)
            .get('/api/admin/profiles')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Access denied');
        });

        it('should return 500 if service fails', async () => {
        adminService.getAllUsers.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/admin/profiles')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error retrieving users');
        });
    });
});

    describe('DELETE /api/admin/profiles/:id', () => {
        it('should delete a user successfully when requested by an admin', async () => {
        adminService.deleteUser.mockResolvedValue({ status: 200, message: 'User deleted successfully' });
    
        const response = await request(app)
            .delete('/api/admin/profiles/2')
            .set('Authorization', `Bearer ${adminToken}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
        });
    
        it('should return 404 if user is not found', async () => {
        adminService.deleteUser.mockRejectedValue({ status: 404, message: 'User not found' });
    
        const response = await request(app)
            .delete('/api/admin/profiles/999')
            .set('Authorization', `Bearer ${adminToken}`);
    
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
        });
    
        it('should return 403 if a non-admin tries to delete a user', async () => {
        const response = await request(app)
            .delete('/api/admin/profiles/2')
            .set('Authorization', `Bearer ${userToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Access denied');
        });
    
        it('should return 500 if service fails', async () => {
        adminService.deleteUser.mockRejectedValue({ status: 500, message: 'Database error' });
    
        const response = await request(app)
            .delete('/api/admin/profiles/2')
            .set('Authorization', `Bearer ${adminToken}`);
    
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error');
        });
    });



