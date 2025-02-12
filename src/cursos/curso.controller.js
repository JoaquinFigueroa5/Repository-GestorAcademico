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

export const getCurso = async (req = request, res = response) => {
    const { limit = 10, desde = 0 } = req.query;
    const query = { state: true };
    try {
        const cursos = await Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limit));

        const total = await Curso.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            cursos
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener cursos',
            error
        })
        
    }
}