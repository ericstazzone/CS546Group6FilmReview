const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const xss = require('xss');

let successFlag = false;

router.get('/', async (req, res) => {
    res.redirect('/home');
});

router.get('/home', async (req, res) => {    
    if (req.session.user) {
        try {
            const user = await userData.getUser(req.session.user);
            res.render('partials/home', {user: user});
        } catch (e) {
            res.redirect('/login'); // TODO
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('partials/login', {success: successFlag});
        successFlag = false;
    }
});

router.get('/signup', async (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('partials/signup');
    }
});

router.post('/login', async (req, res) => {
    let response = {};
    try {
        req.body.username = validation.checkUsername(xss(req.body.username));
        req.body.password = validation.checkPassword(xss(req.body.password));

        const user = await userData.checkUser(xss(req.body.username), xss(req.body.password));
        if (user.id) {
            req.session.user = user.id;
            response.url = '/home';
        } else {
            response.error = 'Internal Server Error';
        }
    } catch (e) {
        response.error = 'Either the username or password is invalid.';
    }
    res.json(response);
});

router.post('/signup', async (req, res) => {
    let response = {error: {}};
    if ('username' in req.body) {
        try {
            req.body.username = validation.checkUsername(xss(req.body.username));
            if (await userData.getUserByUsername(xss(req.body.username))) throw 'Username is taken.';
        } catch (e) {
            response.error.username = e;
        }
    }
    if ('password' in req.body) {
        try {
            req.body.password = validation.checkPassword(xss(req.body.password));
        } catch (e) {
            response.error.password = e;
        }
    }
    if ('confirmPassword' in req.body) {
        try {
            req.body.confirmPassword = validation.checkPassword(xss(req.body.confirmPassword));
            req.body.confirmPassword = await userData.confirmPassword(xss(req.body.password), xss(req.body.confirmPassword), false);
        } catch (e) {
            response.error.confirmPassword = e;
        }
    }
    if ('firstName' in req.body) {
        try {
            req.body.firstName = validation.checkString(xss(req.body.firstName), 'first name');
        } catch (e) {
            response.error.firstName = e;
        }
    }
    if ('lastName' in req.body) {
        try {
            req.body.lastName = validation.checkString(xss(req.body.lastName), 'last name');
        } catch (e) {
            response.error.lastName = e;
        }
    }
    if ('email' in req.body) {
        try {
            req.body.email = validation.checkEmail(xss(req.body.email));
            if (await userData.getUserByEmail(xss(req.body.email))) throw 'Email is in use.';
        } catch (e) {
            response.error.email = e;
        }
    }

    if ((Object.keys(response.error).length === 0) && ('submit' in req.body)) {
        try {
            const user = await userData.createUser(xss(req.body.firstName), xss(req.body.lastName), xss(req.body.username), xss(req.body.password), xss(req.body.email));
            if (user.userInserted) {
                successFlag = true;
                response.url = '/login';
            } else {
                response.error.other = 'Internal Server Error';
            }
        } catch (e) {
            response.error.other = e;
        }
    }

    res.json(response);
});

router.get('/logout', async (req, res) => {
    if (req.session.user) req.session.destroy();
    res.redirect('/login');
});

router.get('/settings', async (req, res) => {
    if (req.session.user) {
        try {
            const user = await userData.getUser(req.session.user);
            res.render('partials/settings', {user: user});
        } catch (e) {
            res.redirect('/login'); // TODO
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/settings', async (req, res) => {
    let response = {};
    if ('username' in req.body) {
        try {
            req.body.username = validation.checkUsername(xss(req.body.username));
            
            const user = await userData.getUser(req.session.user);
            const currentUsername = user.username;
            if ((xss(req.body.username).toLowerCase() !== currentUsername.toLowerCase()) && (await userData.getUserByUsername(xss(req.body.username)))) throw 'Username is taken.';
        } catch (e) {
            response.error = e;
        }
    } else if ('password' in req.body) {
        try {
            req.body.password = validation.checkPassword(xss(req.body.password));
        } catch (e) {
            response.error = e;
        }
        try {
            req.body.confirmPassword = validation.checkPassword(xss(req.body.confirmPassword));
            req.body.confirmPassword = await userData.confirmPassword(xss(req.body.password), xss(req.body.confirmPassword, false));
        } catch (e) {
            response.secondaryError = e;
        }
    } else if ('firstName' in req.body) {
        try {
            req.body.firstName = validation.checkString(xss(req.body.firstName), 'first name');
        } catch (e) {
            response.error = e;
        }
    } else if ('lastName' in req.body) {
        try {
            req.body.lastName = validation.checkString(xss(req.body.lastName), 'last name');
        } catch (e) {
            response.error = e;
        }
    } else if ('email' in req.body) {
        try {
            req.body.email = validation.checkEmail(xss(req.body.email));

            const user = await userData.getUser(req.session.user);
            const currentEmail = user.email;
            if ((xss(req.body.email).toLowerCase() !== currentEmail.toLowerCase()) && (await userData.getUserByEmail(xss(req.body.email)))) throw 'Email is in use.';
        } catch (e) {
            response.error = e;
        }
    }
    
    if ((Object.keys(response).length === 0) && !req.body.stopSubmission) {
        try {
            if ('username' in req.body) {
                userData.updateUsername(req.session.user, xss(req.body.username));
            } else if ('password' in req.body) {
                userData.updatePassword(req.session.user, xss(req.body.password));
            } else if ('firstName' in req.body) {
                userData.updateFirstName(req.session.user, xss(req.body.firstName));
            } else if ('lastName' in req.body) {
                userData.updateLastName(req.session.user, xss(req.body.lastName));
            } else if ('email' in req.body) {
                userData.updateEmail(req.session.user, xss(req.body.email));
            }
            response.url = '/settings';
        } catch (e) {
            response.error = e;
        }
    }

    res.json(response);
});

module.exports = router;