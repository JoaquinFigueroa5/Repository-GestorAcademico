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
    student: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Curso', CursoSchema)