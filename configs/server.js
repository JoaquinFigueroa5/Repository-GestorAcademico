'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const conectarDB = async() => {
    try {
        await dbConnection();
        console.log('Conexion exitoso con la base de datos');
    } catch (error) {
        console.log('Error al conectar con la base de datos', error)
        
    }
}

export const initServer = async() => {
    const app = express();
    const port = process.env.PORT || 3005;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
    } catch (error) {
        console.log(`Server init failed: ${error}`)
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}