'use strict';

require('dotenv').config()
//process.env.DATABASE_URL coming from render
const connectionString = process.env.DATABASE_URL || process.env.CONNECTION_STRING
const pgp = require('pg-promise')({
    //The below function console logs each query that is sent
    query: function (event) {
        console.log('QUERY: ', event.query)
    }
})
const db = pgp(connectionString)

module.exports = db;
