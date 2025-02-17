import userModel from "../user/user.model.js";
import User from "../user/user.model.js";
import Curso from "../cursos/curso.model.js";

export const updateCursosOnlyTeacher = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.role;

    try {
        if(authenticatedUser === "STUDENT_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "No puede modificar ningun curso"
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al querer actualizar el curso"
        })
    }
}

/* export const teacherValidator = async(req, res, next) => {
    try {
        const {teacher} = req.body;

        if (!teacherUser) {
            return res.status(404).json({
                success: false,
                msg: "El usuario no existe o no tiene rol de profesor"
            });
        }


        req.body.teacher = teacherUser._id;

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error en el profesor",
            error: error.message
        })
    }
} */

