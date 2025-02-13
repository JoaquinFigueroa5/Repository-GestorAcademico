import { response, request } from "express";
import User from "./user.model.js";
import Curso from "../cursos/curso.model.js"

export const getUsers = async (req, res) => {
    const { limite = 10, desde = 0} = req.query;
    const query = { state: true};

    try {
        const users = await User.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
            
        const userWithCourseNames = await Promise.all(users.map(async (user) => {
            const cursos = await Curso.find({ _id: { $in: user.cursos } }, 'title');
            return {
                ...user.toObject(),
                cursos: cursos.length > 0 ? cursos.map(curso => curso.title) : ["Sin cursos asignados"]
            }
        }))

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
        const { id } = req.params; // ID del usuario
        const { title } = req.body; // Nombre del curso

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        // Verificar si el usuario tiene el rol de 'STUDENT_ROLE'
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

        // Verificar si el usuario ya está inscrito en el curso
        if (user.cursos.includes(curso._id)) {
            return res.status(400).json({
                success: false,
                msg: "El usuario ya está inscrito en este curso"
            });
        }

        // Agregar el curso al array de cursos del usuario
        user.cursos.push(curso._id);
        await user.save();

        // Poblar los cursos con sus nombres al devolver la respuesta
        const userWithCourses = await User.findById(id).populate({
            path: 'cursos',
            select: 'title' // Solo mostrar el título del curso
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
        
        const userWithCourses = await Curso.findById(id).populate({
            path: 'cursos',
            select: 'title'
        })

        res.status(200).json({
            success: true,
            user: {
                ...user.toObject(),
                cursos: userWithCourses
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al encontrar el usuario'
        })
    }
}

