# Ejercicio 2: API de Gestión de Alumnos y Promedios

## 1. Decisiones de Diseño y Fundamentación

### Modelado de Datos y Cálculo en Tiempo Real
- **Estructura del Recurso:** Cada alumno se representa como un objeto con un `id` único numérico e incremental, un `nombre` (cadena de texto) y un arreglo de tres `notas` numéricas.
- **Campos Derivados (`promedio` y `condicion`):** En lugar de almacenar el promedio y la condición final en el objeto base dentro del arreglo en memoria, estos valores se calculan dinámicamente al momento de procesar cada petición (`GET`, `POST` o `PUT`). Esta decisión garantiza la integridad de los datos, evitando redundancias o inconsistencias en la memoria si las notas son modificadas.
- **Reglas de Condición:**
  - **Promocionado:** Promedio mayor o igual a 8.
  - **Aprobado:** Promedio mayor o igual a 6 y menor a 8.
  - **Reprobado:** Promedio menor a 6.

### Persistencia y Manejo de IDs
- Se utiliza un arreglo nativo en memoria (`alumnos = []`) para mantener la simplicidad exigida por la prueba conceptual.
- La generación de IDs utiliza la longitud actual del arreglo (`alumnos.length + 1`), lo que permite asignar identificadores numéricos correlativos sin dependencias externas.

### Validaciones y Manejo de Errores
1. **Atributo `nombre`:**
   - Es obligatorio, debe ser de tipo texto no vacío.
   - **Unicidad:** Se normaliza utilizando `.trim()` y se valida insensible a mayúsculas/minúsculas (`toLowerCase()`). Se responde con estado **409 Conflict** en caso de duplicados.
2. **Atributo `notas`:**
   - Debe ser estrictamente un arreglo de exactamente 3 elementos de tipo número.
   - Cada nota debe estar contenida en el rango cerrado de `[0, 10]`.
   - Se valida la integridad numérica descartando valores como `NaN` o `null`. Si no cumple las condiciones, se retorna un estado **400 Bad Request**.
3. **Parámetro de Ruta `:id`:**
   - Se valida que sea un número entero positivo mayor a cero. Ante un formato inválido se responde con **400 Bad Request**, y si el ID no corresponde a ningún registro, se retorna **404 Not Found**.

---

## 2. Exposición de Funcionalidades (Endpoints)

- **`GET /api/alumnos`**: Retorna el listado completo de alumnos registrados, agregando de forma dinámica los campos `promedio` y `condicion` para cada uno.
- **`GET /api/alumnos/:id`**: Devuelve los detalles de un alumno específico buscado por su ID numérico.
- **`POST /api/alumnos`**: Recibe `nombre` y un arreglo de 3 `notas`. Realiza las validaciones de negocio, registra al alumno en memoria y responde con el objeto creado junto con su promedio y condición (**201 Created**).
- **`PUT /api/alumnos/:id`**: Actualiza los datos de un alumno existente. Valida que el nuevo nombre no genere colisión con otros alumnos (excluyendo al registro actual).
- **`DELETE /api/alumnos/:id`**: Elimina al alumno especificado por ID de la memoria de la aplicación.

---

## 3. Códigos de Estado HTTP Utilizados

- **`200 OK`**: Petición procesada exitosamente (`GET`, `PUT`, `DELETE`).
- **`201 Created`**: Alumno creado correctamente (`POST`).
- **`400 Bad Request`**: Datos de entrada no válidos (nombre vacío, notas fuera de rango, arreglo de notas con longitud diferente a 3, o ID no numérico).
- **`404 Not Found`**: El alumno solicitado mediante la URL no existe.
- **`409 Conflict`**: Intento de registrar o actualizar un alumno con un nombre que ya se encuentra en uso.