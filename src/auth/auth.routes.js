import { Router } from 'express';
import { Register, Login } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();    

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    Register
);

router.post(
    '/login',
    loginValidator,
    Login
);

export default router;