import { response, request } from "express";
import User from "./user.model.js";
import Curso from "../cursos/curso.model.js"

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { state: true};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const cursosStudents = async(req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, cursos, ...data} = req.body;
        const curso1 = await Curso.findOne({ titile: data.title });

        const curso = await User.findByIdAndUpdate(id, data, {new: true});

        if(!curso1){
            return res.status(404).json({
                success: false,
                msg: "Property not found"
            })
        }

        const curso2 = new Curso({
            ...data,
            cursos: curso._id
        })

        await curso2.save();

        res.status(200).json({
            success: true,
            msg: "Curso añadido",
            curso
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al asiganrlo al curso',
            error
        })
    }
}