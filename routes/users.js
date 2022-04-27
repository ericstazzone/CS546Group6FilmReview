const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const {ObjectId} = require('mongodb');
const { response } = require('express');

router.get('/', async (req, res) => {
    res.redirect('/login'); // NOTE: I often change this to test specific pages, but it should default to '/login'
});

router.get('/login', async (req, res) => {
    res.render('partials/login');
});

router.post('/login', async (req, res) => {
    try {
        req.body.username = validation.checkUsername(req.body.username);
        req.body.password = validation.checkPassword(req.body.password);

        const user = await userData.checkUser(req.body.username, req.body.password);
        if (user.authenticated) {
            req.session.username = req.body.username;
            res.status(200).redirect('/home');
        } else {
            // TODO
            res.status(500).render('partials/login', {error: 'Internal Server Error'});
        }
    } catch (e) {
        // TODO
        res.status(400).render('partials/login', {error: e});
    }
});

router.post('/signup', async (req, res) => {
    try {
        req.body.username = validation.checkUsername(req.body.username);
        req.body.password = validation.checkPassword(req.body.password);
        req.body.confirmPassword = validation.checkPassword(req.body.confirmPassword);

        if (req.body.password !== req.body.confirmPassword) throw 'Error: password fields must match';

        const user = await userData.createUser(req.body.username, req.body.password);
        if (user.userInserted) {
            // TODO: Show message indicating successful sign-up on login page
            res.status(200).redirect('/login');
        } else {
            // TODO
            res.status(500).render('partials/login', {error: 'Internal Server Error'});
        }
    } catch (e) {
        // TODO
        res.status(400).render('partials/signup', {error: e});
    }
});

router.get('/home', async (req, res) => {
    res.render('partials/home');
});

router.get('/logout', async (req, res) => {
    if (req.session.username) req.session.destroy();
    res.redirect('/login');
});





router.post('/validate', async (req, res) => {
    let response = {};
    if ('username' in req.body) {
        try {
            req.body.username = validation.checkUsername(req.body.username);
        } catch (e) {
            response['username'.concat('Error')] = e;
        }
    }
    if ('password' in req.body) {
        try {
            req.body.password = validation.checkPassword(req.body.password);
        } catch (e) {
            response['password'.concat('Error')] = e;
        }
    }
    // try {
    //     req.body.username = validation.checkUsername(req.body.username);
    // } catch (e) {
    //     response.usernameError = e;
    // }
    // try {
    //     req.body.password = validation.checkPassword(req.body.password);
    // } catch (e) {
    //     response.passwordError = e;
    // }
    res.json(response);
});

module.exports = router;