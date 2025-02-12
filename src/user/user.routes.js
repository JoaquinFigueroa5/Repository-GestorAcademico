import { Router } from 'express';
import { getUsers, cursosStudents } from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.put('/registrarCursos',
    [
        validarJWT,
        check("id", "no es un Id valido"),
        validarCampos
    ],
    cursosStudents
)

router.get('/', getUsers)

export default router;