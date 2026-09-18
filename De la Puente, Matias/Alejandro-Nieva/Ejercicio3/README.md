# Ejercicio 3: API de Gestión de Tareas (To-Do List)

## 1. Decisiones de Diseño y Fundamentación

### Modelado del Recurso
- **Estructura:** Cada tarea se representa mediante un objeto con los siguientes atributos:
  - `id`: Identificador entero autoincremental asignado por el servidor.
  - `nombre`: Cadena de texto representativa de la tarea (sanitizada sin espacios residuales).
  - `completada`: Booleano (`true`/`false`) que indica el estado actual de la tarea. Por defecto inicia en `false` si no se especifica.

### Exposición de Funcionalidades y Uso Semántico de Métodos HTTP
- **`GET /api/tareas`**: Obtiene el listado completo de tareas. Soporta un parámetro de consulta opcional (`?completada=true` o `?completada=false`) para filtrar el listado según su estado.
- **`POST /api/tareas`**: Crea una nueva tarea. Exige la presencia del nombre y valida que no exista una tarea duplicada.
- **`PATCH /api/tareas/:id/completar`**: Modificación parcial específica. Permite marcar directamente una tarea como completada sin modificar su nombre ni reenviar el objeto completo.
- **`PUT /api/tareas/:id`**: Modificación total. Reemplaza el nombre y el estado booleano de una tarea existente.
- **`DELETE /api/tareas/:id`**: Elimina físicamente la tarea especificada por su ID.

### Validaciones y Manejo de Errores
1. **Unicidad del Nombre:** No se permiten tareas con nombres duplicados (se evalúa de manera insensible a mayúsculas/minúsculas). Si colisiona, se responde con estado **409 Conflict**.
2. **Tipos de Datos:** El campo `nombre` debe ser texto no vacío. El campo `completada` debe ser estricto de tipo booleano. En caso de tipos erróneos o faltantes, se retorna **400 Bad Request**.
3. **Parámetro de Ruta ID:** Se valida que el `:id` enviado en la URL sea numérico y positivo (**400 Bad Request** si no lo es, y **404 Not Found** si la tarea no existe).

---

## 2. Códigos de Estado HTTP Utilizados

- **`200 OK`**: Solicitud exitosa (`GET`, `PUT`, `PATCH`, `DELETE`).
- **`201 Created`**: Tarea creada con éxito (`POST`).
- **`400 Bad Request`**: Datos recibidos inválidos o incompletos.
- **`404 Not Found`**: Tarea no encontrada por ID.
- **`409 Conflict`**: Intento de registrar una tarea con un nombre ya existente.