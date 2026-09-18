import express from 'express';

const app = express();
app.use(express.json()); // Permite procesar JSON en el body

const PORT = 3000;
let items = []; // Simulación de base de datos

// GET: Obtener todos los elementos o filtrar por Query Params
app.get('/api/recursos', (req, res) => {
    const { limite } = req.query;

    // Validación de Query Param opcional
    if (limite && (isNaN(Number(limite)) || Number(limite) <= 0)) {
        return res.status(400).json({ error: 'El parámetro "limite" debe ser un número positivo.' });
    }

    const resultado = limite ? items.slice(0, Number(limite)) : items;
    res.status(200).json(resultado);
});

// POST: Crear un nuevo elemento
app.post('/api/recursos', (req, res) => {
    const { nombre, precio } = req.body;

    // Validaciones nativas
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio y debe ser un texto.' });
    }

    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ error: 'El campo "precio" debe ser un número mayor a 0.' });
    }

    const nuevoItem = { id: items.length + 1, nombre: nombre.trim(), precio };
    items.push(nuevoItem);

    res.status(201).json(nuevoItem);
});

// PUT: Modificar un elemento por Params y Body
app.put('/api/recursos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;

    // Validación de ID en Params
    const idNumero = Number(id);
    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID enviado debe ser un número válido.' });
    }

    const item = items.find(i => i.id === idNumero);
    if (!item) {
        return res.status(404).json({ error: 'Recurso no encontrado.' });
    }

    // Validaciones nativas del Body
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre debe ser un texto válido.' });
    }

    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' });
    }

    item.nombre = nombre.trim();
    item.precio = precio;

    res.status(200).json(item);
});

// DELETE: Eliminar un recurso
app.delete('/api/recursos/:id', (req, res) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID enviado debe ser un número válido.' });
    }

    const index = items.findIndex(i => i.id === idNumero);
    if (index === -1) {
        return res.status(404).json({ error: 'Recurso no encontrado.' });
    }

    items.splice(index, 1);
    res.status(200).json({ mensaje: 'Recurso eliminado correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});