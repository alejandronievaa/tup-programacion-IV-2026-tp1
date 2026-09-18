# Ejercicio 1: API de Geometría (Rectángulos y Cuadrados)

## Decisiones de Diseño y Fundamentación

### 1. Modelado de la Información
Se definió el recurso `/api/rectangulos`. Cada entidad recibe las dimensiones `base` y `altura`, y el servidor calcula automáticamente las siguientes propiedades de dominio:
* **perimetro**: Calculado como 2 * (base + altura).
* **superficie**: Calculada como base * altura.
* **esCuadrado**: Booleano que determina si base === altura.

### 2. Exposición de Funcionalidades
* **`POST /api/rectangulos`**: Recibe las dimensiones y registra el nuevo cálculo geométrico.
* **`GET /api/rectangulos`**: Devuelve el historial de cálculos realizados (admite filtro opcional por query param `limite`).
* **`GET /api/rectangulos/:id`**: Consulta una figura en particular.
* **`DELETE /api/rectangulos/:id`**: Elimina un registro de la memoria.

### 3. Validaciones
* Se exige que la `base` y la `altura` sean de tipo numérico estrictamente mayores a cero. Si no lo son, la API responde con un estado **`400 Bad Request`**.