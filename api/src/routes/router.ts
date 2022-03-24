import express from 'express';
import RolesController from '../controllers/RolesController';
import UsersController from '../controllers/UsersController';
import {check} from 'express-validator';
const router = express.Router();

router.get('/roles', RolesController.listRoles);

router.get('/users', UsersController.reportUsers);

router.post('/users', [
    check('firstname').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('lastname').not().isEmpty().withMessage('Lastname must have more than 5 characters'),
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
    check('user_password').not().isEmpty().withMessage('Password cannot be empty')
], UsersController.createUser);

router.put('/users', [
    check('firstname').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('lastname').not().isEmpty().withMessage('Lastname must have more than 5 characters'),
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
], UsersController.updateUser);

router.post('/sign_in', [
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
    check('user_password').not().isEmpty().withMessage('Password cannot be empty')
], UsersController.sign_in);

export default router;