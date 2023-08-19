'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

const HOSTNAME = '127.0.0.1';
const PORT = process.env.PORT || process.env.APP_SERVER_PORT;



app.listen(PORT, () => {
    console.log(`App server is listening on http://${HOSTNAME}:${PORT}`);
});

const propertiesRoute = require('./routes/properties');

app.use('/', propertiesRoute);
