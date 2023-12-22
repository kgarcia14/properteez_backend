'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

const HOSTNAME = '127.0.0.1';
const PORT = process.env.APP_SERVER_PORT;
const AUTH_PORT = process.env.TOKEN_SERVER_PORT

// CORS Middleware at the application level for all routes
const cors = require('cors');

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        // origin: 'http://localhost:3000',
        credentials: true,
    }));
} else {
    app.use(cors({
        // origin: 'https://properteez.kurtisgarcia.dev',
        credentials: true,
    }));
}

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
