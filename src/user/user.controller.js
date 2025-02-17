import { response, request } from "express";
import User from "./user.model.js";
import Curso from "../cursos/curso.model.js"

export const getUsers = async (req, res) => {
    const { limite = 10, desde = 0} = req.query;
    const query = { state: true };

    try {
        const users = await User.find(query)
            .populate("cursos", "title")
            .skip(Number(desde))
            .limit(Number(limite));
            
            const userWithCourseNames = await Promise.all(users.map(async (user) => {
                console.log(`Usuario: ${user.name} - Cursos asignados:`, user.cursos);
            
                if (!user.cursos || user.cursos.length === 0) {
                    return { ...user.toObject(), cursos: ["Sin cursos asignados"] };
                }
            
                const cursos = await Curso.find({ 
                    _id: { $in: user.cursos.map(id => new Schema.Types.ObjectId(id)) }
                }, 'title');
            
                console.log("Cursos encontrados:", cursos);
            
                return { 
                    ...user.toObject(),
                    cursos: cursos.map(curso => curso.title) // Devuelve solo los títulos
                };
            }));
            
            

        const total = await User.countDocuments(query);        

        res.status(200).json({
            sucess: true,
            total,
            users: userWithCourseNames
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const cursosStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (user.role !== 'STUDENT_ROLE') {
            return res.status(403).json({
                success: false,
                msg: "El usuario no tiene permiso para inscribirse a cursos"
            });
        }

        // Buscar el curso por el título
        const curso = await Curso.findOne({ title });
        if (!curso) {
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            });
        }

        if (user.cursos.includes(curso._id)) {
            return res.status(400).json({
                success: false,
                msg: "El usuario ya está inscrito en este curso"
            });
        }

        user.cursos.push(curso._id);
        await user.save();

        const userWithCourses = await User.findById(id).populate({
            path: 'cursos',
            select: 'title'
        });

        res.status(200).json({
            success: true,
            msg: "Curso añadido correctamente",
            user: userWithCourses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al asignar el curso',
            error
        });
    }
}

export const searchUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            })
        }
        
        if(!user.cursos || user.cursos.length === 0){
            return res.status(200).json({
                success: true,
                user: {
                    ...user.toObject(),
                    cursos: []
                }
            })
        }

        const cursos  = await Curso.find({ _id: { $in: user.cursos }}, "title")

        res.status(200).json({
            success: true,
            user: {
                ...user.toObject(),
                cursos
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al encontrar el usuario'
        })
    }
}

export const deleteUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true})

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado",
            user
        })
    }catch(error){
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario'
        })
    }
}

export const updateUsuario = async(req, res) => {
    try {
        
        const { id } = req.params;
        const { _id, ...data} = req.body;

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al editar el usuario',
            error
        })
    }
}

