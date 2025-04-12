'use strict'

require('dotenv').config();

const db = require('../db');
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
router.use(express.json());

router.get('/ping', async (req, res) => {
    try {
        // Touch Render PostgreSQL DB
        await db.query('SELECT 1');
        console.log('✅ Render DB touched.');

        // Supabase REST Ping
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
        const TABLE_NAME = process.env.SUPABASE_TABLE_NAME;
        const PING_URL = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=id&limit=1`;
        console.log(PING_URL)

        const supabaseRes = await fetch(PING_URL, {
            method: 'GET',
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });

        if (!supabaseRes.ok) {
            const errorText = await supabaseRes.text();
            throw new Error(`Supabase ping failed: ${supabaseRes.status} - ${errorText}`);
        }

        const result = await supabaseRes.json();
        console.log('✅ Supabase ping successful:', result);

        res.send('Pinged Render DB and Supabase successfully!');
    } catch (err) {
        console.error('❌ Ping failed:', err.message);
        res.status(500).send(`Ping failed: ${err.message}`);
    }
});

module.exports = router;
