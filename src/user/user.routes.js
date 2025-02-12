import { Router } from 'express';
import { getUsers } from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

router.get('/', getUsers)

export default router;