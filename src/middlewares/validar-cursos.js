import User from "../user/user.model.js";

export const limiteCursos = async(req, res, next) => {
    try {
        const { id } = req.params;
        const user  = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            })
        }

        if(user.cursos.length >= 3){
            return res.status(400).json({
                success: false,
                msg: "No puedes agregar más de 3 cursos por alumno"
            })
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error en la validacion de cursos",
            error
        })
    }
}