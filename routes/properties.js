'use strict';

const express = require('express');
const db = require('../db');
const router = express.Router();

//MIDDLEWARE
router.use(express.json())

//ROUTES
//Get all properties
router.get('/properties/:user_id', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM properties WHERE user_id = $1', [req.params.user_id]);
    
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
router.get('/properties/property_info/:id', async (req, res) => {
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
router.post('/properties', async (req, res) => {
    try {
        const results = await db.query('INSERT INTO properties(user_id, street, city, state, zip, mortgage_amount, vacancy, renter_name, renter_number, renter_email, lease_term, rent_amount, rent_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [req.body.user_id, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.mortgage_amount, req.body.vacancy, req.body.renter_name, req.body.renter_number, req.body.renter_email, req.body.lease_term, req.body.rent_amount, req.body.rent_status]);

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

//Edit property
router.put('/properties/:id', async (req, res) => {
    try {
        const results = await db.query('UPDATE properties SET street = $1, city = $2, state = $3, zip = $4, mortgage_amount = $5, vacancy = $6, renter_name = $7, renter_number = $8, renter_email = $9, lease_term = $10, rent_amount = $11, rent_status = $12 WHERE id = $13 RETURNING *', [req.body.street, req.body.city, req.body.state, req.body.zip, req.body.mortgage_amount, req.body.vacancy, req.body.renter_name, req.body.renter_number, req.body.renter_email, req.body.lease_term, req.body.rent_amount, req.body.rent_status, req.params.id]);
    
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
router.delete('/properties/:id', async (req, res) => {
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