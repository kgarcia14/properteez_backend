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
        res.sendStatus(400).send('Token not present');
    }

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
}

// Middleware to upload image before executing POST || PUT routes. This will be uploaded to app server
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './images')
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// })

// Middleware to upload image before executing POST || PUT routes. This will be uploaded to Google Cloud
const uploadImage = multer({
    storage: multer.memoryStorage(),
}).single('property_image');

//ROUTES
//Get all properties
router.get('/properties/:user_id', validateToken, async (req, res) => {
    console.log('Token is valid!');

    try {
        const results = await db.query('SELECT * FROM properties WHERE user_id = $1 order by id', [req.params.user_id]);
    
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
        const id = req.cookies['id'];
        // const email = req.cookies['email'];

        let googlePublicUrl;

        if (file) {
            const uploadToGoogle = await uploadImageToGoogle(file, id);
            googlePublicUrl = uploadToGoogle;
        }
        const imageUrl = !file ? 'https://properteezapi.kurtisgarcia.dev/images/default_property.jpg' : googlePublicUrl;
        
        const results = await db.query('INSERT INTO properties(user_id, street, city, state, zip, home_type, mortgage_amount, vacancy, renter_name, renter_number, renter_email, lease_term, rent_amount, rent_status, property_image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *', [data.user_id, data.street, data.city, data.state, data.zip, data.home_type, data.mortgage_amount, data.vacancy, data.renter_name, data.renter_number, data.renter_email, data.lease_term, data.rent_amount, data.rent_status, imageUrl]);

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
    console.log(req.file);

    const data = JSON.parse(req.body);

    try {
        const results = await db.query('UPDATE properties SET street = $1, city = $2, state = $3, zip = $4, mortgage_amount = $5, vacancy = $6, renter_name = $7, renter_number = $8, renter_email = $9, lease_term = $10, rent_amount = $11, rent_status = $12, property_image = $13 WHERE id = $14 RETURNING *', [req.body.street, req.body.city, req.body.state, req.body.zip, req.body.mortgage_amount, req.body.vacancy, req.body.renter_name, req.body.renter_number, req.body.renter_email, req.body.lease_term, req.body.rent_amount, req.body.rent_status, req.file.path, req.params.id]);
    
        console.log(results);
    
        res.status(200).json({
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