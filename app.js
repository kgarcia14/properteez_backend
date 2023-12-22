'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

const HOSTNAME = '127.0.0.1';
const PORT = process.env.APP_SERVER_PORT;
const AUTH_PORT = process.env.TOKEN_SERVER_PORT

// CORS Middleware
// const cors = require('cors');
// app.options('*', cors());

// app.use(cors({
//     origin: 'https://properteez.kurtisgarcia.dev',
//     credentials: true,
// }));

app.use(() => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://properteez.kurtisgarcia.dev"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);

    next();
});

app.options("*", (req, res) => {
  console.log("preflight");
  if (
    req.headers.origin === "https://properteez.kurtisgarcia.dev" &&
    allowMethods.includes(req.headers["access-control-request-method"]) &&
    allowHeaders.includes(req.headers["access-control-request-headers"])
  ) {
    console.log("pass");
    return res.status(204).send();
  } else {
    console.log("fail");
  }
});


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
