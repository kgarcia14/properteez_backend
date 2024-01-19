'use strict';

require('dotenv').config();
const express = require('express');
const db = require('../db');
const router = express.Router();
const multer = require('multer');
const cookieParser = require('cookie-parser');
const uploadImageToGoogle = require('../gcStorage');

const jwt = require('jsonwebtoken');

//MIDDLEWARE
router.use(express.json());

//Middleware to validate token before executing route
const validateToken = (req, res, next) => {
    const authHeader = `Bearer ${req.cookies.accessToken}`;
    const token = authHeader.split(" ")[1];

    if (token === null) {
        res.status(400).send('Token not present');
    }

    if (req.cookies && Object.keys(req.cookies).length) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).send('Token Invalid');
            } 
            else {
                console.log(user) 
                req.user = user;
                next();
            }
        });
    } else {
        res.status(204).send('No Content')
    }
}

// Middleware to upload image before executing POST || PUT routes. This will be uploaded to Google Cloud
const uploadImage = multer({
    storage: multer.memoryStorage(),
}).single('property_image');

//ROUTES
//Check for User ID which is an http Cookie
router.get('/validateUser', validateToken, async (req, res) => {
    // using parseInt to make both the same type so that we can compare the two
    const userId = parseInt(req.user.userId)
    const cookieUserId = parseInt(req.cookies['id']);

    try {
        console.log(userId, typeof(userId))
        console.log(cookieUserId, typeof(cookieUserId))
        if (userId === cookieUserId) {
            return res.status(200).send('Valid User ID');
        } else {
            if (process.env.NODE_ENV === 'development') {
                res.clearCookie('id', {
                    domain: 'localhost',
                    httpOnly: true,
                    sameSite: 'lax',
                });
                res.clearCookie('email', {
                    domain: 'localhost',
                    sameSite: 'lax',
                });
                res.clearCookie('accessToken', {
                    domain: 'localhost',
                    httpOnly: true,
                    sameSite: 'lax',
                });
                res.clearCookie('refreshToken', {
                    domain: 'localhost',
                    httpOnly: true,
                    sameSite: 'lax',
                });
            } else {
                res.clearCookie('id', {
                    domain: '.kurtisgarcia.dev',
                    secure: true,
                    sameSite: 'none',
                });
                res.clearCookie('email', {
                    domain: '.kurtisgarcia.dev',
                    secure: true,
                    sameSite: 'none',
                });
                res.clearCookie('accessToken', {
                    domain: '.kurtisgarcia.dev',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                res.clearCookie('refreshToken', {
                    domain: '.kurtisgarcia.dev',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
            }
            return res.status(401).send('Invalid User ID!');
        }
    } catch (err) {
        console.log(err);
    }
})

//Get all properties
router.get('/properties', validateToken, async (req, res) => {
    console.log('Token is valid!');

    try {
        const id = req.cookies['id'];

        const results = await db.query('SELECT * FROM properties WHERE user_id = $1 order by id', [id]);
    
        res.status(200).json({
            status: 'success',
            results: results.length,
            data: {
                properties: results
            }
        });
    } catch (err) {
        console.log(err);
    }
});

//Get one property to display in details modal
router.get('/properties/propertyInfo/:id', validateToken, async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM properties WHERE id = $1', [req.params.id]);

        res.status(200).json({
            status: 'success',
            data: {
                property: results[0]
            }
        });
    } catch (err) {
        console.log(err)
    }
}); 

//Create property
router.post('/properties', validateToken, uploadImage, async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const userId = req.cookies['id'];

        let googlePublicUrl;

        if (file) {
            const uploadToGoogle = await uploadImageToGoogle(file, userId);
            googlePublicUrl = uploadToGoogle;
        }
        const imageUrl = !file ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2146&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : googlePublicUrl;
        
        const results = await db.query('INSERT INTO properties(user_id, street, city, state, zip, home_type, mortgage_amount, vacancy, renter_name, renter_number, renter_email, lease_start, lease_end, rent_amount, rent_status, property_image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *', [userId, data.street, data.city, data.state, data.zip, data.home_type, data.mortgage_amount, data.vacancy, data.renter_name, data.renter_number, data.renter_email, data.lease_start, data.lease_end, data.rent_amount, data.rent_status, imageUrl]);

        console.log(results);
        
        res.status(201).json({
            status: 'success',
            data: {
                property: results,
            }
        });
    } catch (err) {
        console.log(err);
    }
});

//Edit property
router.put('/properties/:id', validateToken, uploadImage, async (req, res) => {
    try {
        console.log(req.file);

        const data = req.body;
        const file = req.file;
        const userId = req.cookies['id'];

        let googlePublicUrl;

        if (file) {
            const uploadToGoogle = await uploadImageToGoogle(file, userId);
            googlePublicUrl = uploadToGoogle;
        }
        const imageUrl = !file ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2146&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : googlePublicUrl;

        const results = await db.query('UPDATE properties SET street = $1, city = $2, state = $3, zip = $4, home_type = $5, mortgage_amount = $6, vacancy = $7, renter_name = $8, renter_number = $9, renter_email = $10, lease_start = $11, lease_end = $12, rent_amount = $13, rent_status = $14, property_image = $15 WHERE id = $16 RETURNING *', [data.street, data.city, data.state, data.zip, data.home_type, data.mortgage_amount, data.vacancy, data.renter_name, data.renter_number, data.renter_email, data.lease_start, data.lease_end, data.rent_amount, data.rent_status, imageUrl, req.params.id]);
    
        console.log(results);
    
        res.status(201).json({
            status: 'success',
            data: {
                property: results
            }
        });
    } catch (err) {
        console.log(err);
    }

});

//Delete property
router.delete('/properties/:id', validateToken, async (req, res) => {
    try {
        const results = await db.query('DELETE FROM properties WHERE id = $1', [req.params.id]);

        res.status(204).json({
            status: "success"
        }); 
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;