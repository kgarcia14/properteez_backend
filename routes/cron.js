'use strict'

const db = require('../db');

const express = require('express');
const router = express.Router();
router.use(express.json());

router.get('/ping', async (req, res) => {
    try {
        // Touch the DB to keep it awake
        await db.query('SELECT 1');
        console.log('Received ping, I am awake!!! + DB touched.');
        res.send('Received ping, I am awake!!! + DB touched.');
    } catch (err) {
        console.error('DB ping failed:', err.message);
        res.status(500).send('Ping failed: could not reach DB');
    }
});

module.exports = router;