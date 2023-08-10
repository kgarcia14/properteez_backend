'use strict';

const express = require('express');
const app = express();
require('dotenv').config()

const hostname = '127.0.0.1';
const PORT = process.env.PORT || 3333;



app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`)
});

const propertiesRoute = require('./routes/properties');
const usersRoute = require('./routes/users');

app.use('/', propertiesRoute);
app.use('/', usersRoute);