import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3000;
let alumnos = []; // Arreglo interno en memoria

// Función auxiliar para calcular promedio y condición
const calcularEstado = (notas) => {
    const suma = notas.reduce((acc, curr) => acc + curr, 0);
    const promedio = Number((suma / notas.length).toFixed(2));

    let condicion = 'reprobado';
    if (promedio >= 8) {
        condicion = 'promocionado';
    } else if (promedio >= 6) {
        condicion = 'aprobado';
    }

    return { promedio, condicion };
};

// GET: Obtener todos los alumnos con sus datos derivados
app.get('/api/alumnos', (req, res) => {
    const respuesta = alumnos.map(a => {
        const { promedio, condicion } = calcularEstado(a.notas);
        return { ...a, promedio, condicion };
    });
    res.status(200).json(respuesta);
});

// GET por ID: Obtener un solo alumno con promedio y condición
app.get('/api/alumnos/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
    }

    const alumno = alumnos.find(a => a.id === idNumero);
    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado.' });
    }

    const { promedio, condicion } = calcularEstado(alumno.notas);
    res.status(200).json({ ...alumno, promedio, condicion });
});

// POST: Crear un alumno
app.post('/api/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // Validación de nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto.' });
    }

    const nombreNormalizado = nombre.trim();

    // Validar nombre único
    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombreNormalizado.toLowerCase());
    if (existe) {
        return res.status(409).json({ error: 'Ya existe un alumno registrado con ese nombre.' });
    }

    // Validación de notas (deben ser exactamente 3 números entre 0 y 10)
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'El campo "notas" debe ser un arreglo de exactamente 3 números.' });
    }

    const notasValidas = notas.every(n => typeof n === 'number' && !isNaN(n) && n >= 0 && n <= 10);
    if (!notasValidas) {
        return res.status(400).json({ error: 'Cada nota debe ser un número válido entre 0 y 10.' });
    }

    const nuevoAlumno = {
        id: alumnos.length + 1,
        nombre: nombreNormalizado,
        notas
    };

    alumnos.push(nuevoAlumno);

    const { promedio, condicion } = calcularEstado(nuevoAlumno.notas);
    res.status(201).json({ ...nuevoAlumno, promedio, condicion });
});

// PUT: Modificar un alumno
app.put('/api/alumnos/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    const alumno = alumnos.find(a => a.id === idNumero);
    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado.' });
    }

    const { nombre, notas } = req.body;

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto.' });
    }

    const nombreNormalizado = nombre.trim();

    // Validar que no choque con otro alumno (excluyendo al que se está editando)
    const existeOtro = alumnos.some(a => a.id !== idNumero && a.nombre.toLowerCase() === nombreNormalizado.toLowerCase());
    if (existeOtro) {
        return res.status(409).json({ error: 'Ya existe otro alumno con ese nombre.' });
    }

    // Validar notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Las notas deben ser un arreglo de 3 elementos.' });
    }

    const notasValidas = notas.every(n => typeof n === 'number' && !isNaN(n) && n >= 0 && n <= 10);
    if (!notasValidas) {
        return res.status(400).json({ error: 'Las notas deben ser números entre 0 y 10.' });
    }

    alumno.nombre = nombreNormalizado;
    alumno.notas = notas;

    const { promedio, condicion } = calcularEstado(alumno.notas);
    res.status(200).json({ ...alumno, promedio, condicion });
});

// DELETE: Eliminar un alumno
app.delete('/api/alumnos/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser válido.' });
    }

    const index = alumnos.findIndex(a => a.id === idNumero);
    if (index === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado.' });
    }

    alumnos.splice(index, 1);
    res.status(200).json({ mensaje: 'Alumno eliminado correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor de Ejercicio 2 corriendo en http://localhost:${PORT}`);
});