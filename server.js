const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN API HACKATON
const API_BASE_URL = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com";
const CREDENCIALES = {
    nickName: "dedson", // Asegúrate de que sea nickName con N mayúscula
    teamName: "Los Multiplexores Maquiavélicos",
    password: "hack2026"
};

let db;
let BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWRzb24iLCJleHAiOjE3NzM4MjU1ODZ9.3PaFBa2fSRQyPNEvualOwv-C8Q5DoT0mNMrSGjlhPnI";

// 1. INICIALIZACIÓN DE BASE DE DATOS
(async () => {
    db = await open({
        filename: './usuarios_upm.db',
        driver: sqlite3.Database
    });
    
    // Tabla Usuarios
    await db.exec(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, dni TEXT UNIQUE, nombre TEXT, edad INTEGER, provincia TEXT, perfil TEXT, rol TEXT)`);
    // Tabla Histórico Meteo
    await db.exec(`CREATE TABLE IF NOT EXISTS historico_meteo (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, provincia TEXT, temp TEXT, descripcion TEXT)`);
    // Tabla Histórico IA
    await db.exec(`CREATE TABLE IF NOT EXISTS historico_ia (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, dni TEXT, pregunta TEXT, respuesta TEXT)`);
    
    console.log("✅ Base de datos y tablas listas.");
})();

// 2. VERIFICAR USUARIO (LOGIN)
app.get('/verificar-usuario/:dni', async (req, res) => {
    const dni = req.params.dni.toUpperCase();
    try {
        const usuario = await db.get(`SELECT * FROM usuarios WHERE dni = ?`, [dni]);
        if (usuario) {
            res.json({ registrado: true, usuario: usuario });
        } else {
            res.json({ registrado: false });
        }
    } catch (e) {
        res.status(500).json({ error: "Error en la BD" });
    }
});

// 3. REGISTRO
app.post('/registro', async (req, res) => {
    const data = req.body;
    let perfil = "Estándar";
    const necesidadesMedicas = data.necesidades.filter(n => n !== 'mascotas').length > 0;
    if (necesidadesMedicas) perfil = "Dependiente";
    else if (parseInt(data.edad) < 18) perfil = "Menor de Edad";

    try {
        await db.run(`INSERT INTO usuarios (dni, nombre, edad, provincia, perfil, rol) VALUES (?, ?, ?, ?, ?, ?)`,
            [data.dni.toUpperCase(), data.nombre, data.edad, data.provincia, perfil, data.tipoUsuario]);
        res.json({ mensaje: "Éxito", perfil, nombre: data.nombre, provincia: data.provincia });
    } catch (e) {
        res.status(400).json({ error: "DNI ya registrado" });
    }
});

// 4. DATA DASHBOARD (Clima Hackaton + Consejo IA)
app.get('/dashboard-data/:perfil', async (req, res) => {
    const perfil = req.params.perfil;
    try {
        // Pedir clima a la API Hackaton
        const weatherRes = await fetch(`${API_BASE_URL}/weather?disaster=false`, {
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
        });
        const clima = await weatherRes.json();

        // Pedir consejo a la IA
        const promptRes = await fetch(`${API_BASE_URL}/prompt`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_prompt: "Eres un experto en emergencias de la UPM.",
                user_prompt: `Dame un consejo corto para un perfil ${perfil} con este clima: ${clima.weather[0].description}`
            })
        });
        const iaData = await promptRes.json();
        const consejo = iaData.answer || iaData.response;

        // GUARDAR EN HISTÓRICO METEO
        await db.run(`INSERT INTO historico_meteo (provincia, temp, descripcion) VALUES (?, ?, ?)`,
            ["General", Math.round(clima.main.temp) + "°C", clima.weather[0].description]);

        res.json({ clima, consejoIA: consejo });
    } catch (e) {
        res.status(500).json({ error: "Error con la API Hackaton" });
    }
});

// 5. CONSULTA IA CHAT
app.post('/consulta-ia', async (req, res) => {
    const { pregunta, dni } = req.body;
    try {
        const response = await fetch(`${API_BASE_URL}/prompt`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_prompt: "Asistente de emergencias conciso.",
                user_prompt: pregunta
            })
        });
        const data = await response.json();
        const respuestaIA = data.answer || data.response;

        // GUARDAR EN HISTÓRICO IA
        await db.run(`INSERT INTO historico_ia (dni, pregunta, respuesta) VALUES (?, ?, ?)`, [dni, pregunta, respuestaIA]);

        res.json({ respuesta: respuestaIA });
    } catch (e) {
        res.status(500).json({ error: "Error en la IA" });
    }
});

// 6. HISTÓRICOS
app.get('/historicos', async (req, res) => {
    try {
        const meteo = await db.all(`SELECT * FROM historico_meteo ORDER BY fecha DESC LIMIT 10`);
        const ia = await db.all(`SELECT * FROM historico_ia ORDER BY fecha DESC LIMIT 10`);
        res.json({ meteo, ia });
    } catch (e) {
        res.status(500).json({ error: "Error al recuperar históricos" });
    }
});

app.post('/lanzar-alerta', async (req, res) => {
    const { mensaje, rol, dni } = req.body;

    // Validación de seguridad en el backend
    if (rol !== 'administrador') {
        return res.status(403).json({ error: "Acceso denegado: No tienes permisos de administrador." });
    }

    try {
        console.log(`🚨 ALERTA GLOBAL INICIADA POR ${dni}: ${mensaje}`);
        // Aquí podrías añadir lógica para enviar a la API de Hackaton si fuera necesario
        res.json({ mensaje: "¡Alerta enviada con éxito a todos los sistemas!" });
    } catch (e) {
        res.status(500).json({ error: "Error al procesar alerta" });
    }
})

app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));