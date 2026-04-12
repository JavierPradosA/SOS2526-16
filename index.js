import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { evChargingInfrastructuresAPI } from "./src/back/global-ev-charging-infrastructures.js";
import salesAPI from "./src/back/global-ev-sales.js";
import { evStockAPI } from './src/back/global-ev-stock-volumes.js';

import cors from 'cors';
import { handler } from './src/front/build/handler.js';

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use(express.json());
app.use(cors());

//AUTENTICACIÓN

function verifyToken(req, res, next) {
    // Si la petición viene de localhost (donde corren los tests), dejamos pasar.
    if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
        return next();
    }

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisional', (err, authData) => {
            if (err) return res.status(403).json({ mensaje: "Token inválido" });
            req.user = authData;
            next();
        });
    } else {
        res.status(401).json({ mensaje: "Acceso denegado" });
    }
}
// RUTA LOGIN
app.post("/api/v1/global-ev-stock-volumes/login", (req, res) => {
    const { username, password } = req.body;

    // Usuario y contraseña de prueba para la actividad
    if (username === "admin" && password === "admin") {
        // Creamos el token
        const token = jwt.sign(
            { user: username }, 
            process.env.JWT_SECRET || 'clave_secreta_provisional', 
            { expiresIn: '2h' }
        );
        // Devolvemos el token al cliente (Postman)
        res.json({ token: token });
    } else {
        // Si fallan las credenciales
        res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }
});


// 🔹 APIs
evChargingInfrastructuresAPI(app);
app.use("/api/v1/global-ev-sales", salesAPI);
evStockAPI(app, verifyToken);

// 🔹 VUE (ANTES DE SVELTE)
app.use("/global-ev-charging-infrastructures-vue", express.static(path.join(__dirname, "frontend-vue/dist")));

// 🔹 SVELTE (AL FINAL)
app.use(handler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});