import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3000;
let tareas = []; // Arreglo interno en memoria

// GET: Consultar todas las tareas o filtrar por estado (?completada=true/false)
app.get('/api/tareas', (req, res) => {
    const { completada } = req.query;

    if (completada !== undefined) {
        const esCompletada = completada === 'true';
        const tareasFiltradas = tareas.filter(t => t.completada === esCompletada);
        return res.status(200).json(tareasFiltradas);
    }

    res.status(200).json(tareas);
});

// GET por ID: Consultar tarea específica
app.get('/api/tareas/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
    }

    const tarea = tareas.find(t => t.id === idNumero);
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    res.status(200).json(tarea);
});

// POST: Crear una tarea
app.post('/api/tareas', (req, res) => {
    const { nombre, completada = false } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la tarea es obligatorio y debe ser texto.' });
    }

    const nombreNormalizado = nombre.trim();

    // Validar unicidad
    const existe = tareas.some(t => t.nombre.toLowerCase() === nombreNormalizado.toLowerCase());
    if (existe) {
        return res.status(409).json({ error: 'Ya existe una tarea registrada con ese nombre.' });
    }

    if (typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'El estado "completada" debe ser un valor booleano (true o false).' });
    }

    const nuevaTarea = {
        id: tareas.length + 1,
        nombre: nombreNormalizado,
        completada
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// PUT: Modificar una tarea completa (Nombre / Estado)
app.put('/api/tareas/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser válido.' });
    }

    const tarea = tareas.find(t => t.id === idNumero);
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    const { nombre, completada } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
    }

    const nombreNormalizado = nombre.trim();

    // Validar nombre único excluyendo la tarea actual
    const existeOtro = tareas.some(t => t.id !== idNumero && t.nombre.toLowerCase() === nombreNormalizado.toLowerCase());
    if (existeOtro) {
        return res.status(409).json({ error: 'Ya existe otra tarea con ese nombre.' });
    }

    if (typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'El estado "completada" debe ser booleano.' });
    }

    tarea.nombre = nombreNormalizado;
    tarea.completada = completada;

    res.status(200).json(tarea);
});

// PATCH: Cambiar o marcar estado de completado
app.patch('/api/tareas/:id/completar', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser válido.' });
    }

    const tarea = tareas.find(t => t.id === idNumero);
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    // Si se envía un valor booleano en el body se le asigna, si no, invierte el valor actual
    if (req.body && typeof req.body.completada === 'boolean') {
        tarea.completada = req.body.completada;
    } else {
        tarea.completada = !tarea.completada;
    }

    res.status(200).json(tarea);
});

// DELETE: Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const idNumero = Number(req.params.id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID debe ser válido.' });
    }

    const index = tareas.findIndex(t => t.id === idNumero);
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    tareas.splice(index, 1);
    res.status(200).json({ mensaje: 'Tarea eliminada correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor de Ejercicio 3 corriendo en http://localhost:${PORT}`);
});