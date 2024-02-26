'use strict';

require('dotenv').config();
const express = require('express');
const db = require('../db');
const router = express.Router();
const cookieParser = require('cookie-parser');

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

// ROUTES
//Get all tasks
router.get('/tasks', validateToken, async (req, res) => {
    console.log('Token is valid!');

    try {
        const id = req.cookies['id'];

        const results = await db.query('SELECT * FROM tasks WHERE user_id = $1 order by id', [id]);
    
        res.status(200).json({
            status: 'success',
            results: results.length,
            data: {
                tasks: results
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Get one task
router.get('/tasks/taskDetails/:id', validateToken, async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);

        res.status(200).json({
            status: 'success',
            data: {
                task: results[0]
            }
        });
    } catch (err) {
        console.log(err)
    }
}); 

// Create Task
router.post('/tasks', validateToken, async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const userId = req.cookies['id'];
        
        const results = await db.query('INSERT INTO tasks(user_id, location, title, description, status, complete) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [userId, data.task_location, data.task_title, data.task_description, data.task_status, false]);

        console.log(results);
        
        res.status(201).json({
            status: 'success',
            data: {
                task: results,
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// edit task
router.put('/tasks/:id', validateToken, async (req, res) => {
    try {
        const data = req.body;

        const results = await db.query('UPDATE tasks SET location = $1, title = $2, description = $3, status = $4, complete = $5 WHERE id = $6 RETURNING *', [data.location, data.title, data.description, data.status, data.complete, req.params.id]);
    
        console.log(results);
    
        res.status(201).json({
            status: 'success',
            data: {
                task: results
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// mark task complete by updating
router.put('/markTaskComplete/:id', validateToken, async (req, res) => {
    try {

        const results = await db.query('UPDATE tasks SET complete = $1 WHERE id = $2 RETURNING *', [true, req.params.id]);
    
        console.log(results);
    
        res.status(201).json({
            status: 'success',
            data: {
                task: results
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// mark task complete by updating
router.put('/markTaskIncomplete/:id', validateToken, async (req, res) => {
    try {

        const results = await db.query('UPDATE tasks SET complete = $1 WHERE id = $2 RETURNING *', [false, req.params.id]);
    
        console.log(results);
    
        res.status(201).json({
            status: 'success',
            data: {
                task: results
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Delete task
router.delete('/tasks/:id', validateToken, async (req, res) => {
    try {
        const results = await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);

        res.status(204).json({
            status: "success"
        }); 
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;