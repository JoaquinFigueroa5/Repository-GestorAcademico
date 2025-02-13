import { Router } from 'express';
import { getUsers, cursosStudents, searchUser} from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { limiteCursos } from '../middlewares/validar-cursos.js';

const router = Router();

router.put(
    '/registrarCursos/:id',
    [
        validarJWT,
        check("id", "no es un Id valido"),
        limiteCursos,
        validarCampos
    ],
    cursosStudents
)

router.get('/', getUsers)

router.get(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    searchUser
)

export default router;