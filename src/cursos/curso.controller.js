import { response, request } from "express";
import { hash } from "argon2";
import Curso from './curso.model.js'

export const saveCurso = async (req, res) =>{
    try {
        const data = req.body;
        const user = await Curso.create({
            title: data.title,
            descripcion: data.descripcion,
        })

        return res.status(201).json({
            msg: "Curso registrado",
            cursoDetails: {
                title: user.title
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Curso',
            error: error.msg
        })
    }
}

export const getCurso = async (req, res) => {
    try {
        const cursos = await Curso.find();

        return res.status(200).json({
            msg: "Cursos obtenidos con éxito",
            cursos: cursos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un problema al obtener los cursos',
            error: error.message || error.msg
        });
    }
};
