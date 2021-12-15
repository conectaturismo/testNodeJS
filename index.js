const express = require('express');
var app = express();

// Libreria JWT para la autenticacion
const jwt = require('jsonwebtoken');
const config = require('./config.js');
app.set('key', config.key);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Lectura del fichero validateAuth.json
const fs = require('fs');
const validateAuth = JSON.parse(fs.readFileSync('./validateAuth.json'));

// Libreria de swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Arrancamos el servidor
app.listen(8080, function() {
    console.log('Starting server');
});

// Función de login
app.post('/login', (req, res)=>{
    // Comprobación de la existencia de la cabecera
    const id = req.header('Authentication');
    if(id === null || id === undefined){
        res.status(400).send('Auth missing in header');
        return;
    }
    
    // Comprobamos si existe
    let valid = false;
    let user;
    for(let v of validateAuth){
        if(v.id === id){
            valid = true;
            user = v;
            break;
        }
    }

    if(!valid) {
        res.status(401).send('User doesn\'t exist');
        return;
    }

    // Comprobamos la fecha de expiración
    var d = new Date();
    d.setMilliseconds(user.expiration);
    if(d < new Date()){
        res.status(401).send('Date expired');
        return;
    }

    // Creamos el token y lo devolvemos
    const token = jwt.sign({
        id: user.id,
        expiration: d.getTime()
    }, app.get('key'), {
        expiresIn: 1440
    });

    res.json({
        message: 'Correct login',
        token: token
    });
});

// Middleware para comprobar el token
const middleware = express.Router();
middleware.use((req,res,next)=>{

    // Recuperamos el token y lo verificamos
    const token = req.header('access-token');

    if(token){
        jwt.verify(token, app.get('key'), (err, decoded)=>{
            if(err){
                res.status(400).send('Token error');
                return;
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.status(400).send('Missing token');
        return;
    }
});


// Función para recibir los datos
app.post('/receiveData', middleware, (req, res)=>{
    const data = req.body;
    // Comprobamos el código

    if(data.code === null || data.code === undefined){
        res.status(400).send('Error in param code');
        return;
    }

    let code = parseInt(data.code);
    if(isNaN(code)){
        res.status(400).send('Error in param code');
        return;
    }

    // Comprobamos el nombre
    if(data.name === null || data.name === undefined || data.name.trim().length === 0){
        res.status(400).send('Error in param name');
        return;
    }

    // Comprobamos la fecha
    if(data.date === null || data.date === undefined || data.date.trim().length === 0){
        res.status(400).send('Error in param date');
        return;
    }

    if(isNaN(new Date(data.date).getTime())){
        res.status(400).send('Error in param date');
        return;
    }


    // Si todo está correcto, devolvemos la diferencia en segundos entre las fechas
    let expirationMilliseconds = req.decoded.expiration;
    
    let dateReceive = new Date(data.date);
    let seconds = Math.round((dateReceive.getTime() - expirationMilliseconds) / 1000);


    res.json({
        expirationInSeconds: seconds
    });


});