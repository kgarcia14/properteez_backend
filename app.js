'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

const HOSTNAME = process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'properteezapi.kurtisgarcia.dev';
const PORT = process.env.APP_SERVER_PORT;
const AUTH_PORT = process.env.TOKEN_SERVER_PORT

//ping server
const http = require('http');
const https = require('https');
const { CronJob } = require('cron');

const pingUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/ping' : 'https://properteezapi.kurtisgarcia.dev/ping';
const requestProtocol = process.env.NODE_ENV === 'development' ? http : https;

const pingServer = () => {
    requestProtocol.get(pingUrl, (res) => {
      console.log(`Ping successful. Status code: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Error pinging server: ${err.message}`);
    });
  };

const job = new CronJob(
	'* * * * *', // cronTime
	function () {
		console.log('You will see this message every minute');
        pingServer();
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);


// CORS Middleware at the application level for all routes
const cors = require('cors');
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://properteez.kurtisgarcia.dev',
    credentials: true,
}));

app.use('/images', express.static('images'));

//App Server
app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`App server is listening on http://${HOSTNAME}:${PORT}`);
    } else {
        console.log(`App server is listening on https://${HOSTNAME}:${PORT}`);
    }
});

//Auth Server
app.listen(AUTH_PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Auth server is listening on http://${HOSTNAME}:${AUTH_PORT}`);
    } else {
        console.log(`App server is listening on https://${HOSTNAME}:${AUTH_PORT}`);
    }
})

const cronRoute = require('./routes/cron');
const usersRoute = require('./routes/users');
const propertiesRoute = require('./routes/properties');

app.use('/', cronRoute);
app.use('/', usersRoute);
app.use('/', propertiesRoute);
