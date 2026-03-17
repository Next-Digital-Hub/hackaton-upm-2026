# Documento de Requisitos

## Introducción

MVP para el día de competición del hackathon. El sistema permite visualizar una lista de libros obtenida desde un backend Spring Boot, presentada en una interfaz React con tarjetas individuales por libro. El backend sirve datos mockeados y el frontend consume el endpoint HTTP para renderizar la información.

## Glosario

- **Backend**: Servidor Spring Boot (Java 17) que expone endpoints REST. Paquete base: `etsisi.albertoynico.backend`
- **Frontend**: Aplicación Vite + React + TypeScript que consume la API del Backend
- **Libro**: Entidad del dominio que representa un libro con autor, descripción y año de publicación
- **LibroController**: Controlador REST del Backend que gestiona las peticiones HTTP relacionadas con libros
- **LibroCard**: Componente React del Frontend que muestra la información de un Libro individual
- **LandingPage**: Página principal del Frontend que muestra la lista de tarjetas de libros

## Requisitos

### Requisito 1: Modelo de datos Libro

**Historia de usuario:** Como desarrollador, quiero tener un modelo de datos Libro definido tanto en el backend como en el frontend, para que ambos sistemas compartan la misma estructura de datos.

#### Criterios de aceptación

1. THE Libro SHALL contener los campos: id (numérico), autor (texto), descripción (texto) y año (numérico)
2. WHEN el Backend serializa un Libro a JSON, THE Backend SHALL producir un objeto JSON con las claves: id, autor, descripcion y anio
3. THE Frontend SHALL definir una interfaz TypeScript Libro con los mismos campos que el modelo del Backend

### Requisito 2: Endpoint HTTP para obtener libros

**Historia de usuario:** Como frontend, quiero consumir un endpoint HTTP que devuelva una lista de libros, para poder mostrarlos en la interfaz de usuario.

#### Criterios de aceptación

1. WHEN el Frontend realiza una petición GET a /api/libros, THE LibroController SHALL responder con un código HTTP 200 y un array JSON de objetos Libro
2. THE LibroController SHALL devolver una lista mockeada de al menos 3 libros con datos representativos
3. WHEN el Backend recibe una petición GET a /api/libros, THE LibroController SHALL incluir la cabecera CORS adecuada para permitir peticiones desde el Frontend

### Requisito 3: Landing page con lista de tarjetas

**Historia de usuario:** Como usuario, quiero ver una página principal con tarjetas de libros, para poder explorar la colección disponible.

#### Criterios de aceptación

1. WHEN el Frontend carga la LandingPage, THE Frontend SHALL realizar una petición al endpoint /api/libros y mostrar los resultados
2. WHEN los libros se cargan correctamente, THE LandingPage SHALL renderizar un componente LibroCard por cada libro recibido
3. THE LibroCard SHALL mostrar el autor, la descripción y el año del libro
4. WHILE los libros se están cargando, THE LandingPage SHALL mostrar un indicador de carga
5. IF la petición al Backend falla, THEN THE LandingPage SHALL mostrar un mensaje de error descriptivo

### Requisito 4: Limpieza del boilerplate de Vite

**Historia de usuario:** Como desarrollador, quiero eliminar el contenido de ejemplo de Vite, para que la aplicación solo muestre el contenido relevante del proyecto.

#### Criterios de aceptación

1. THE Frontend SHALL reemplazar el contenido por defecto de App.tsx con el componente LandingPage
2. THE Frontend SHALL eliminar los estilos, logos y assets del template de Vite que no sean necesarios
