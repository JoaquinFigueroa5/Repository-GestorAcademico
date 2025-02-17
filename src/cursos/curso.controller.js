import { response, request } from "express";
import { hash } from "argon2";
import mongoose from 'mongoose';
import Curso from './curso.model.js';
import User from "../user/user.model.js";

export const saveCurso = async (req, res) =>{
    try {
        const { title, descripcion, student } = req.body;

        const students = await User.find({ email: { $in: student } });

        if(!Array.isArray(student)) {
            return res.status(400).json({
                success: false,
                msg: "El campo 'student' debe ser un arreglo de correos electrónicos"
            });
        }

        if (students.length !== student.length) {
            return res.status(404).json({
                success: false,
                msg: "Uno o más estudiantes no fueron encontrados"
            });
        }


        const curso = new Curso({
            title,
            descripcion,
            student: students.map(s => s._id)
        });

        await curso.save();

        const savedCurso = await Curso.findById(curso._id).populate({
            path: 'student',
            select: 'name surname'
        })

        res.status(200).json({
            success: true,
            curso: savedCurso,
        
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al registrar curso',
            error
        })
    }
}

export const getCurso = async (req, res) => {
    const { limit = 10, desde = 0 } = req.query;
    const query = { state: true };

    try {
        const cursos = await Curso.find()
            .skip(Number(desde))
            .limit(Number(limit));


        const cursosConUsuarios = await Promise.all(
            cursos.map(async(curso) => {
                const students = await User.find({ _id: { $in: curso.student } });

                return {
                    ...curso.toObject(),
                    students: students.length > 0 ? students.map(s => `${s.name}` + " " + `${s.surname}`) : ["Sin estudiantes"]
                };
            })
        );

        const total = await Curso.countDocuments(query);


        return res.status(200).json({
            success: true,
            msg: "Cursos obtenidos con éxito",
            total,
            cursos: cursosConUsuarios
        });

    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return res.status(500).json({
            msg: "Hubo un problema al obtener los cursos",
            error: error.message || error.msg
        });
    }
};


export const getCursoById = async(req, res) => {
    try {
        const { id } = req.params;
    
        const curso = await Curso.findById(id);

        if(!curso){
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            })
        }

        res.status(200).json({
            success: true,
            curso
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el curso',
            error
        })
    }
}

export const updateCurso = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, student, ...data } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                msg: "ID de curso no válido"
            });
        }

        let studentIds = [];

        if (student) {
            if (!Array.isArray(student)) {
                return res.status(400).json({
                    success: false,
                    msg: "El campo 'student' debe ser un arreglo de correos electrónicos"
                });
            }

            const students = await User.find({ email: { $in: student } });

            if (students.length !== student.length) {
                return res.status(404).json({
                    success: false,
                    msg: "Uno o más estudiantes no fueron encontrados"
                });
            }

            studentIds = students.map(s => s._id);
        }

        const curso = await Curso.findByIdAndUpdate(id, data, { new: true });

        if (!curso) {
            return res.status(404).json({
                success: false,
                msg: "El curso no fue encontrado"
            });
        }

        if (student) {
            curso.student = studentIds;
            await curso.save();
        }

        const savedCurso = await Curso.findById(curso._id).populate({
            path: 'student',
            select: 'name surname'
        });

        res.status(200).json({
            success: true,
            msg: "Curso actualizado",
            curso: savedCurso
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el curso",
            error: error.message
        });
    }
};



export const deleteCurso = async(req, res) => {
    const { id } = req.params;

    try {

        const curso = await Curso.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            msg: "Curso eliminado exitosamente",
            curso
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            msg: "Error al querer eliminar el curso"
        })
    }
}

