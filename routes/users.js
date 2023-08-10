'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

//MIDDLEWARE
router.use(express.json())

//Need route to add user email & password
router.post('/register', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.user_password, 10);
        const results = await db.query('INSERT INTO users(user_email, hashed_password) VALUES($1, $2) RETURNING *', [req.body.user_email, hash]);
        res.status(201).json('Registered successfully!!!');
    } catch (err){
        console.log(err);
    }
});

//Need route to log in with credentials
router.post('/login', async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [req.body.user_email]);
        // console.log(user[0].hashed_password, req.body);

        if (user) {
            const isauthenticated = await bcrypt.compare(req.body.user_password, user[0].hashed_password);

            if (isauthenticated) {
                res.status(201).json('You are now logged in!!!');
            } else {
                res.status(408).json('Incorrect password');
            }
        } else {
            res.status(404).json('User not found!')
        }
    } catch(err) {
        console.log(err);
    }
})



//Need route to delete user accounts email & password (will need to delete user and user's properties)



module.exports = router;