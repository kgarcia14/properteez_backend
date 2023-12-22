'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

const HOSTNAME = '127.0.0.1';
const PORT = process.env.APP_SERVER_PORT;
const AUTH_PORT = process.env.TOKEN_SERVER_PORT

// CORS Middleware
const cors = require('cors');
app.use(cors({
    origin: 'https://properteez.kurtisgarcia.dev',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//App Server
app.listen(PORT, () => {
    console.log(`App server is listening on http://${HOSTNAME}:${PORT}`);
});

//Auth Server
app.listen(AUTH_PORT, () => {
    console.log(`Auth server is listening on http://${HOSTNAME}:${AUTH_PORT}`);
})

const usersRoute = require('./routes/users');
const propertiesRoute = require('./routes/properties');

app.use('/', usersRoute);
app.use('/', propertiesRoute);
