'use strict'

const express = require('express');
const router = express.Router();
router.use(express.json());

router.get('/ping', (req, res) => {
    console.log('Received ping, I am awake!!!')
    res.send('Received ping, I am awake!!!');
})

module.exports = router;