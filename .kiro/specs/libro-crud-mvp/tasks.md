# Plan de Implementación: Libro CRUD MVP

## Visión general

Implementación incremental del MVP: primero el modelo de datos compartido, luego el endpoint backend, después los componentes frontend, y finalmente la limpieza del boilerplate.

## Tareas

- [x] 1. Crear modelo Libro y endpoint en el Backend
  - [x] 1.1 Crear la clase `Libro` en `backend/src/main/java/etsisi/albertoynico/backend/model/Libro.java`
    - Campos: `id` (Long), `autor` (String), `descripcion` (String), `anio` (int)
    - Usar anotaciones Lombok: `@Data`, `@AllArgsConstructor`, `@NoArgsConstructor`
    - _Requisitos: 1.1, 1.2_
  - [x] 1.2 Crear el controlador `LibroController` en `backend/src/main/java/etsisi/albertoynico/backend/controller/LibroController.java`
    - Anotar con `@RestController`, `@RequestMapping("/api/libros")`, `@CrossOrigin(origins = "*")`
    - Implementar método `getLibros()` con `@GetMapping` que devuelva una lista mockeada de al menos 3 libros
    - _Requisitos: 2.1, 2.2, 2.3_
  - [ ]* 1.3 Escribir test unitario del endpoint con MockMvc
    - Verificar que GET /api/libros devuelve status 200
    - Verificar que la respuesta es un array JSON con al menos 3 elementos
    - Verificar que cada elemento tiene los campos: id, autor, descripcion, anio
    - _Requisitos: 2.1, 2.2_
  - [ ]* 1.4 Escribir test de propiedad para round-trip de serialización de Libro
    - **Propiedad 1: Round-trip de serialización de Libro**
    - Usar jqwik para generar objetos Libro aleatorios, serializar a JSON con Jackson ObjectMapper y deserializar de vuelta, verificando equivalencia
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 1.1, 1.2**

- [x] 2. Checkpoint - Verificar backend
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 3. Crear interfaz Libro y servicio HTTP en el Frontend
  - [x] 3.1 Crear la interfaz TypeScript `Libro` en `frontend/src/types/Libro.ts`
    - Campos: `id` (number), `autor` (string), `descripcion` (string), `anio` (number)
    - _Requisitos: 1.3_
  - [x] 3.2 Crear el servicio `libroService` en `frontend/src/services/libroService.ts`
    - Función `getLibros()` que haga fetch a `http://localhost:8080/api/libros`
    - Lanzar error si la respuesta no es ok
    - Retornar el array de Libro parseado
    - _Requisitos: 2.1_

- [x] 4. Crear componentes React y limpiar boilerplate
  - [x] 4.1 Crear componente `LibroCard` en `frontend/src/components/LibroCard.tsx`
    - Props: `libro: Libro`
    - Renderizar autor, descripción y año en una tarjeta con estilos básicos
    - _Requisitos: 3.3_
  - [x] 4.2 Crear componente `LandingPage` en `frontend/src/components/LandingPage.tsx`
    - Usar `useState` y `useEffect` para cargar libros desde `getLibros()`
    - Gestionar tres estados: cargando, error, datos
    - Renderizar un `LibroCard` por cada libro
    - Mostrar indicador de carga mientras se obtienen los datos
    - Mostrar mensaje de error si la petición falla
    - _Requisitos: 3.1, 3.2, 3.4, 3.5_
  - [x] 4.3 Reemplazar contenido de `App.tsx` y limpiar boilerplate de Vite
    - Sustituir el contenido de App.tsx para que renderice solo `LandingPage`
    - Eliminar `App.css` y los assets innecesarios del template de Vite (logos, imágenes de ejemplo)
    - Actualizar `index.css` con estilos mínimos limpios
    - _Requisitos: 4.1, 4.2_
  - [ ]* 4.4 Escribir test de propiedad para renderizado de lista de libros
    - **Propiedad 2: Renderizado correcto de lista de libros**
    - Usar fast-check para generar listas aleatorias de Libro, renderizar LandingPage con datos mockeados, verificar que se renderizan N tarjetas y cada una contiene autor, descripción y año
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 3.2, 3.3**

- [x] 5. Checkpoint final - Verificar integración completa
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y se pueden omitir para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedades validan corrección universal
- Los tests unitarios validan ejemplos concretos y edge cases