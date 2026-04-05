const authService = require('../../src/services/authService');
const prisma = require('../../src/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock current dependencies
jest.mock('../../src/db', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('AuthService Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should throw error if user already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
            
            await expect(authService.signup('test@test.com', 'pwd', 'Name'))
                .rejects.toThrow('User already exists');
        });

        it('should create a new user and return a token', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_pwd');
            prisma.user.create.mockResolvedValue({ id: '2', email: 'new@test.com', role: 'USER' });
            jwt.sign.mockReturnValue('mock_token');

            const result = await authService.signup('new@test.com', 'pwd', 'New User');

            expect(prisma.user.create).toHaveBeenCalled();
            expect(result).toHaveProperty('token', 'mock_token');
            expect(result.user.email).toBe('new@test.com');
        });
    });

    describe('login', () => {
        it('should throw error if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            
            await expect(authService.login('notfound@test.com', 'pwd'))
                .rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password is invalid', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: '1', password: 'hashed_pwd' });
            bcrypt.compare.mockResolvedValue(false);
            
            await expect(authService.login('test@test.com', 'wrong_pwd'))
                .rejects.toThrow('Invalid credentials');
        });

        it('should return a token on successful login', async () => {
            const mockUser = { id: '1', email: 'test@test.com', password: 'hashed_pwd', role: 'USER' };
            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock_token');

            const result = await authService.login('test@test.com', 'pwd');

            expect(result).toHaveProperty('token', 'mock_token');
            expect(result.user.id).toBe('1');
        });
    });

    describe('generateToken', () => {
        it('should sign a JWT with user details', () => {
            const mockUser = { id: '1', role: 'USER', email: 'test@test.com', name: 'Test' };
            jwt.sign.mockReturnValue('signed_token');

            const result = authService.generateToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: '1', role: 'USER' },
                expect.any(String),
                { expiresIn: '7d' }
            );
            expect(result.token).toBe('signed_token');
        });
    });
});
