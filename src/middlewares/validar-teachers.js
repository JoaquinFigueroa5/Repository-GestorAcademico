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


