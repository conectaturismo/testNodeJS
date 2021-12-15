# test NodeJS

Instalación: 

npm install
npm start

URL de Swagger: http://localhost:8080/api-docs/



Desarrolla un micro-banckend que cumpla con los siguientes parametros:

1. Puerto de servicio: 8080
2. Requiere Authentication a través de una cabecera.
3. Válidar valor Authentication con los valores del archivo validateAuth.json y la fecha de expiración con el momento actual.
4. Requiere datos con la estructura:
```json
{
  "code": 15,                     // Integer | Required
  "name": "Test",                 // String  | Required
  "description": "Description",   // String  | Optional
  "date": "2022-05-05T10:00:00"   // Date    | Required
}
```
6. Validar la estructura recibida.
7. Responder con la diferencia de tiempo que hay entre la fecha recibida y la fecha de expiracion del archivo validateAuth.json
8. Integrar un sistema de log que registre cada una de las tareas del micro-backend.
9. Define el servicio web mediante Swagger 2.0 u OpenAPI 3.0
