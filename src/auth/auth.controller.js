import { hash, verify } from "argon2";
import User from '../user/user.model.js';
import { generarJWT } from "../helpers/generate-JWT.js";


export const Login = async(req, res) => {
    const { email, password, username } = req.body;

    try {
        
        const user = await User.findOne({
            $or: [
                {email}, {username}
            ]
        })

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.state) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta, bobo'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Inicio de sesion exitoso!',
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const Register = async(req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            cursos: data.cursos
            
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }
}