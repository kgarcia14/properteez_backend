'use strict';

const express = require('express');
const app = express();
require('dotenv').config()

const hostname = '127.0.0.1';
const PORT = '3333';



app.listen(process.env.PORT || PORT, () => {
 console.log(`Server is listening on http://${hostname}:${PORT}`);
});

const propertiesRoute = require('./routes/properties');
const usersRoute = require('./routes/users');

app.use('/', propertiesRoute);
app.use('/', usersRoute);