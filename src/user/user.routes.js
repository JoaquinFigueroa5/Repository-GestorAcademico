import { Router } from 'express';
import { getUsers, cursosStudents, searchUser, deleteUsuario, updateUsuario} from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { limiteCursos } from '../middlewares/validar-cursos.js';
import { editarStudent, eliminarStudent } from '../middlewares/validar-usuarios.js';

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

router.delete(
    '/:id',
    [
        validarJWT,
        eliminarStudent,
        validarCampos

    ],
    deleteUsuario
)

router.put(
    "/:id",
    [
        validarJWT,
        editarStudent,
        validarCampos
    ],
    updateUsuario
)

export default router;