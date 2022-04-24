const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const {ObjectId} = require('mongodb');

router.get('/', async (req, res) => {
    res.redirect('/home'); // NOTE: I often change this to test specific pages, but it should default to '/login'
});

router.get('/login', async (req, res) => {
    res.render('partials/login');
});

router.post('/login', async (req, res) => {
    res.redirect('/home');
});

router.get('/home', async (req, res) => {
    res.render('partials/home');
});

router.get('/logout', async (req, res) => {
    if (req.session.username) req.session.destroy();
    res.redirect('/login');
});

module.exports = router;