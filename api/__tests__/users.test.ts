import supertest from 'supertest';
import {mocked} from 'ts-jest/utils';
import UsersController from '../src/controllers/UsersController';

describe('User Test Case', () => {

    beforeEach(() => jest.clearAllMocks());

    test('SignUp', () => {
        let body = {
            avatar: null,
            firstname: 'User',
            lastname: 'Test',
            email: 'usertest@gmail.com',
            user_password: 'mypassword',
            user_status: 1,
            id_role: 2
        };

        supertest('http://localhost:8080').get('/api/users').then(res => {
            expect(res.statusCode).toBe(404);
        });
    });
});