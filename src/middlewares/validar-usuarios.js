import User from '../user/user.model.js';

export const editarStudent = async(req, res, next) => {
    try {
        
        const { id } =  req.params;
        const user = await User.findById(id);
        const authenticatedUser = req.user.role;

        if(!user){
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            })
        }

        if(authenticatedUser === "STUDENT_ROLE"){
            return res.status(400).json({
                success: false,
                msg: "No puede modificar este usuario"
            })
        }

        next();
    

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error en eliminacion del estudiante',
            error
        })
    }
}

export const eliminarStudent = async(req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = req.user.id;

    try {
        
        if(authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "No tiene el permiso para eliminar este usuario."
            })
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar el usuario"
        })
    }
}

export const onlyStudents = async(req, res, next) => {
    const student = req.user.role;
    
    try{
        if(student !== "TEACHER_ROLE"){
            return res.status(403).json({
                success: false,
                msg:"No puede agregar un maestro como estudiante"
            })

            
        }
        next();
    }catch(error){
        res.status(500).json({
            success: false,
            msg: "Error al agregar el estudiante"
        })
    }
}

