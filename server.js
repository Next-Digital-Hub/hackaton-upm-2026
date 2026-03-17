const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fetch = require('node-fetch'); // Recuerda: npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

const CREDENCIALES = {
    nickname : "dedson",
    teamName : "Los Multiplexores Maquiavélicos",
    password : "hack2026"
};

let db;

// 1. INICIALIZACIÓN DE BASE DE DATOS (SQLite)
(async () => {
    db = await open({
        filename: './usuarios_upm.db',
        driver: sqlite3.Database
    });
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dni TEXT UNIQUE,
            nombre TEXT,
            edad INTEGER,
            provincia TEXT,
            perfil TEXT,
            rol TEXT
        )
    `);
    console.log("✅ Base de datos SQLite conectada y lista.");
})();

const ADMIN_CODE = "UPM2026";

// 2. RUTA DE REGISTRO (Guardar en BD y calcular perfil)
app.post('/registro', async (req, res) => {
    const data = req.body;

    // Validación Admin
    if (data.tipoUsuario === 'administrador' && data.adminCode !== ADMIN_CODE) {
        return res.status(401).json({ error: "Código admin incorrecto" });
    }

    // Lógica de Perfilado
    let perfil = "Estándar";
    const necesidadesMedicas = data.necesidades.filter(n => n !== 'mascotas').length > 0;
    
    if (necesidadesMedicas) {
        perfil = "Dependiente";
    } else if (parseInt(data.edad) < 18) {
        perfil = "Menor de Edad";
    }

    try {
        // Guardar en SQLite
        await db.run(
            `INSERT INTO usuarios (dni, nombre, edad, provincia, perfil, rol) VALUES (?, ?, ?, ?, ?, ?)`,
            [data.dni, data.nombre, data.edad, data.provincia, perfil, data.tipoUsuario]
        );
        
        console.log(`👤 Usuario registrado: ${data.nombre} (${perfil})`);
        res.json({ mensaje: "Éxito", perfil: perfil, nombre: data.nombre, provincia: data.provincia });
    } catch (e) {
        console.error("Error al insertar:", e.message);
        res.status(400).json({ error: "El DNI ya existe o error en los datos." });
    }
});

// 3. RUTA DE CLIMA (Conexión con API externa)
app.get('/clima/:provincia', async (req, res) => {
    const prov = req.params.provincia;
    const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWRzb24iLCJleHAiOjE3NzM4MjU1ODZ9.3PaFBa2fSRQyPNEvualOwv-C8Q5DoT0mNMrSGjlhPnI"; // <--- SUSTITUYE POR TU CLAVE DE OPENWEATHER
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${prov},es&units=metric&lang=es&appid=${API_KEY}`;
        const response = await fetch(url);
        const climaData = await response.json();
        
        if (climaData.cod !== 200) {
            return res.status(404).json({ error: "No se encontró el clima para esa provincia" });
        }

        res.json({
            temp: Math.round(climaData.main.temp) + "°C",
            desc: climaData.weather[0].description,
            icon: climaData.weather[0].icon
        });
    } catch (e) {
        res.status(500).json({ error: "Error conectando con la API de clima" });
    }
});
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
        res.status(500).json({ error: "Error en la base de datos" });
    }
});
app.get('/historicos', async (req, res) => {
    try {
        const meteo = await db.all(`SELECT * FROM historico_meteo ORDER BY fecha DESC LIMIT 20`);
        const ia = await db.all(`SELECT * FROM historico_ia ORDER BY fecha DESC LIMIT 20`);
        res.json({ meteo, ia });
    } catch (e) {
        res.status(500).json({ error: "No se pudo recuperar el historial" });
    }
});
// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});