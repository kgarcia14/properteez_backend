'use strict';

require('dotenv').config()
const express = require('express');
const db = require('../db');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const cors = require('cors');

//MIDDLEWARE
router.use(express.json());
router.use(cookieParser());
// router.use(cors({
//     origin: 'https://properteez.kurtisgarcia.dev',
//     credentials: true,
// }));


//Refresh Tokens Array
let refreshTokens = [];

//Generate accessToken Function
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

// Generate refreshToken Function
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15m'});
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    return refreshToken;
}

//Register user email & password
router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const hash = await bcrypt.hash(req.body.user_password, 10);
        const results = await db.query('INSERT INTO users(user_email, hashed_password) VALUES($1, $2) RETURNING *', [req.body.user_email, hash]);
        
        const accessToken = generateAccessToken({user: results[0].user_email});
        const refreshToken = generateRefreshToken({user: results[0].user_email});

        if (process.env.NODE_ENV === 'development') {
            res.cookie('id', results[0].id, {
                domain: 'localhost',
                maxAge: 600000,
                sameSite: 'lax',
            })
            res.cookie('email', results[0].user_email, {
                domain: 'localhost',
                maxAge: 600000,
                sameSite: 'lax',
            })
            res.cookie('jwt', accessToken, {
                domain: 'localhost',
                maxAge: 600000,
                httpOnly: true,
                sameSite: 'lax',
            })
        } else {
            res.cookie('id', results[0].id, {
                domain: '.kurtisgarcia.dev',
                maxAge: 600000,
                secure: true,
                sameSite: 'None',
            })
            res.cookie('email', results[0].user_email, {
                domain: '.kurtisgarcia.dev',
                maxAge: 600000,
                secure: true,
                sameSite: 'None',
            })
            res.cookie('jwt', accessToken, {
                domain: '.kurtisgarcia.dev',
                maxAge: 600000,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            })
        }

        res.status(201).json({results: results[0], accessToken: accessToken});
    } catch (err){
        console.log(err);

        if (err.detail.includes('already exists')) {
            res.status(400).json({message: 'email exists!'});
        }

    }
});

//Log in with credentials and return accessToken and refreshToken
router.post('/login', async (req, res) => {
    console.log(req.body); 
    try {
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [req.body.user_email]);

        console.log(user);
        
        if (user) {
            const isauthenticated = await bcrypt.compare(req.body.user_password, user[0].hashed_password);

            if (isauthenticated) {
                const accessToken = generateAccessToken({user: user[0].user_email});
                const refreshToken = generateRefreshToken({user: user[0].user_email});

                if (process.env.NODE_ENV === 'development') {
                    res.cookie('id', user[0].id, {
                        domain: 'localhost',
                        maxAge: 600000,
                        sameSite: 'lax',
                    })
                    res.cookie('email', user[0].user_email, {
                        domain: 'localhost',
                        maxAge: 600000,
                        sameSite: 'lax',
                    })
                    res.cookie('jwt', accessToken, {
                        domain: 'localhost',
                        maxAge: 600000,
                        httpOnly: true,
                        sameSite: 'lax',
                    })
                } else {
                    res.cookie('id', user[0].id, {
                        domain: '.kurtisgarcia.dev',
                        maxAge: 600000,
                        secure: true,
                        sameSite: 'None',
                    })
                    res.cookie('email', user[0].user_email, {
                        domain: '.kurtisgarcia.dev',
                        maxAge: 600000,
                        secure: true,
                        sameSite: 'None',
                    })
                    res.cookie('jwt', accessToken, {
                        domain: '.kurtisgarcia.dev',
                        maxAge: 600000,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                    })
                }

                res.status(201).json({user: user[0], accessToken: accessToken});
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

//Refresh accessToken and refreshToken and remove old refreshToken
router.post('/refreshToken', async (req, res) => {
    console.log(req.body, '!!!!');
    if (!refreshTokens.includes(req.body.token)) { 
        res.status(400).send('Refresh Token Invalid!')
    }

    refreshTokens = refreshTokens.filter(token => token !== req.body.token);

    const accessToken = generateAccessToken({user: req.body.user_email});
    const refreshToken = generateRefreshToken({user: req.body.user_email}); 
    
    res.status(201).json({accessToken: accessToken}) 
});

//Delete refresh tokens
router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);

    res.status(204).send('Logged out!');
})

//Need route to delete user accounts email & password (will need to delete user and user's properties)



module.exports = router;