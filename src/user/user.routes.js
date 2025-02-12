import { Router } from 'express';
import { userRegister, getUsers, userLogin } from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    userRegister
);

router.post(
    '/login',
    loginValidator,
    userLogin
)

router.get('/', getUsers)

export default router;