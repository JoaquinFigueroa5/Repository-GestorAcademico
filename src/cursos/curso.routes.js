import { Router } from "express";
import { check } from "express-validator";
import { saveCurso, getCurso, updateCurso, deleteCurso} from "./curso.controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { updateCursosOnlyTeacher } from "../middlewares/validar-teachers.js"
import { onlyStudents } from "../middlewares/validar-usuarios.js"

const router = Router();

router.post(
    '/register',
    [
        validarJWT,
        updateCursosOnlyTeacher,
        onlyStudents,
        validarCampos
    ],
    saveCurso
)

router.get('/', getCurso)

router.put(
    '/:id',
    [
        validarJWT,
        updateCursosOnlyTeacher,
        validarCampos
    ],
    updateCurso
)

router.delete(
    '/:id',
    [
        validarJWT,
        updateCursosOnlyTeacher,
        validarCampos
    ],
    deleteCurso
)

export default router;