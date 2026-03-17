## Obtención del contexto de usuario activo desde el controlador

### Problema

La clase CitizenController no tiene forma actualmente de recuperar el contexto del usuario activo con sus atributos, 
para usarlo como contexto en el prompt enviado al LLM

## Solución

Utilizar `Principal` y `getByName` para buscar el usuario en el repositorio


## Almacenamiento del token

### Problema

Actualmente, utilizamos un token de desarrollo como variable de entorno configurado en los parámetros de corrido de nuestra app.
Sin embargo, no sabemos si este token debe obtenerse desde cada sesión de usuario, encapsulando sus datos, para luego poder recuperarlos.

