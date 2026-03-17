const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_CODE = "UPM2026"; // Código secreto

app.post('/registro', (req, res) => {
    const data = req.body;
    
    // Validación de Administrador
    if (data.tipoUsuario === 'administrador' && data.adminCode !== ADMIN_CODE) {
        return res.status(401).json({ error: "Código admin incorrecto" });
    }

    // Lógica de Perfilado
    let perfil = "Estándar";
    const necesidadesMedicas = data.necesidades.filter(n => n !== 'mascotas').length > 0;

    if (necesidadesMedicas || data.dependiente) {
        perfil = "Dependiente";
    } else if (parseInt(data.edad) < 18) {
        perfil = "Menor de Edad";
    }

    console.log("Usuario registrado:", { ...data, perfilAsignado: perfil });
    
    res.json({ mensaje: "Éxito", perfil: perfil, nombre: data.nombre });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));