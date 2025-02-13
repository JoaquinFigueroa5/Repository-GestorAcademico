import User from '../user/user.model.js';

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({email});

    if(existeEmail){
        throw new Error(`El correo ${email} ya existe en la base de datos`)
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El usuario con el id ${id} no existe en la base de datos`)
    }
}
