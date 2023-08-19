'use strict';

require('dotenv').config();

const express = require('express');
const app = express()

const HOSTNAME = '127.0.0.1';
const PORT = process.env.PORT || process.env.TOKEN_SERVER_PORT

app.listen(PORT, () => {
    console.log(`Auth server is listening on http://${HOSTNAME}:${PORT}`);
})

const usersRoute = require('./routes/users');

app.use('/', usersRoute);