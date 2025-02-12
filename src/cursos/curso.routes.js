import { Router } from "express";
import { check } from "express-validator";
import { saveCurso, getCurso} from "./curso.controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/register',
    [
        validarJWT,
        validarCampos
    ],
    saveCurso
)

router.get('/', getCurso)

export default router;