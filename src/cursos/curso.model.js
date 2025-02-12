import { Schema, model } from "mongoose";

const CursoSchema = Schema({
    title: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    state: {
        type: Boolean,
        defalut: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Curso', CursoSchema)