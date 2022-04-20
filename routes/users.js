const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const {ObjectId} = require('mongodb');

router.get('/', async (req, res) => {
    res.render('partials/login');
});

module.exports = router;