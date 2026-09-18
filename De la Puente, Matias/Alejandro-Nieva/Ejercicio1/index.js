import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3000;
let rectangulos = [];

// GET: Obtener todos los rectángulos o filtrar con límite
app.get('/api/rectangulos', (req, res) => {
    const { limite } = req.query;

    if (limite && (isNaN(Number(limite)) || Number(limite) <= 0)) {
        return res.status(400).json({ error: 'El parámetro "limite" debe ser un número positivo.' });
    }

    const resultado = limite ? rectangulos.slice(0, Number(limite)) : rectangulos;
    res.status(200).json(resultado);
});

// GET: Obtener por ID
app.get('/api/rectangulos/:id', (req, res) => {
    const idNumero = Number(req.params.id);

    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID enviado debe ser un número válido.' });
    }

    const rectangulo = rectangulos.find(r => r.id === idNumero);
    if (!rectangulo) {
        return res.status(404).json({ error: 'Rectángulo no encontrado.' });
    }

    res.status(200).json(rectangulo);
});

// POST: Crear y calcular perímetro, superficie y si es cuadrado
app.post('/api/rectangulos', (req, res) => {
    const { base, altura } = req.body;

    if (base === undefined || typeof base !== 'number' || base <= 0) {
        return res.status(400).json({ error: 'La "base" es obligatoria y debe ser un número mayor a 0.' });
    }

    if (altura === undefined || typeof altura !== 'number' || altura <= 0) {
        return res.status(400).json({ error: 'La "altura" es obligatoria y debe ser un número mayor a 0.' });
    }

    const nuevoRectangulo = {
        id: rectangulos.length + 1,
        base,
        altura,
        perimetro: 2 * (base + altura),
        superficie: base * altura,
        esCuadrado: base === altura
    };

    rectangulos.push(nuevoRectangulo);
    res.status(201).json(nuevoRectangulo);
});

// DELETE: Eliminar un registro
app.delete('/api/rectangulos/:id', (req, res) => {
    const idNumero = Number(req.params.id);

    if (isNaN(idNumero) || idNumero <= 0) {
        return res.status(400).json({ error: 'El ID enviado debe ser un número válido.' });
    }

    const index = rectangulos.findIndex(r => r.id === idNumero);
    if (index === -1) {
        return res.status(404).json({ error: 'Rectángulo no encontrado.' });
    }

    rectangulos.splice(index, 1);
    res.status(200).json({ mensaje: 'Rectángulo eliminado correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});