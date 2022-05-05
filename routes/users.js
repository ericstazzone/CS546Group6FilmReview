const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const movieData = data.movies;
const reviewData = data.reviews;
const validation = require('../validation');
const {ObjectId} = require('mongodb');
const { response } = require('express');
const { updateUsername } = require('../data/users');

let successFlag = false;

router.get('/', async (req, res) => {
    res.redirect('/home');
});

router.get('/login', async (req, res) => {
    // userData.updatePassword('6269786a8c3f8451f36f8d21', 'mypassword')
    if (req.session.user) {
        res.redirect('/home');
    } else {
        // NOTE: Old query string method
        // if (req.query.success) {
        if (successFlag) {
            successFlag = false;
            res.render('partials/login', {success: true});
        } else {
            res.render('partials/login');
        }
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
    try {
        req.body.username = validation.checkUsername(req.body.username);
        req.body.password = validation.checkPassword(req.body.password);

        const user = await userData.checkUser(req.body.username, req.body.password);
        if (user.id) {
            req.session.user = user.id;
            res.status(200).redirect('/home');
        } else {
            res.status(500).render('partials/login', {error: 'Internal Server Error', noRaise: true});
        }
    } catch (e) {
        res.status(400).render('partials/login', {error: e, noRaise: true});
    }
});

router.post('/signup', async (req, res) => {
    try {
        req.body.username = validation.checkUsername(req.body.username);
        req.body.password = validation.checkPassword(req.body.password);
        req.body.confirmPassword = await userData.confirmPassword(req.body.password, req.body.confirmPassword, false);
        req.body.firstName = validation.checkString(req.body.firstName, 'first name');
        req.body.lastName = validation.checkString(req.body.lastName, 'last name');
        req.body.email = validation.checkEmail(req.body.email);

        const user = await userData.createUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email);
        if (user.userInserted) {
            const success = encodeURIComponent(true);
            successFlag = true;
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
    res.render('partials/home', {user: req.session.user});
    
});

router.get('/logout', async (req, res) => {
    if (req.session.user) req.session.destroy();
    res.redirect('/login');
});

router.post('/loginValidation', async (req, res) => {
    let response = {};
    try {
        // TODO: Account for internal server error
        const user = await userData.checkUser(req.body.username, req.body.password);
    } catch (e) {
        response['error'] = 'Either the username or password is invalid.';
    }
    res.json(response);
});

router.post('/signupValidation', async (req, res) => {
    let response = {};
    if ('username' in req.body) {
        try {
            req.body.username = validation.checkUsername(req.body.username);
            if (await userData.getUserByUsername(req.body.username)) throw 'Username is taken.';
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
    if ('confirmPassword' in req.body) {
        try {
            req.body.confirmPassword = await userData.confirmPassword(req.body.password, req.body.confirmPassword, false);
        } catch (e) {
            response['confirmPassword'.concat('Error')] = e;
        }
    }
    if ('firstName' in req.body) {
        try {
            req.body.firstName = validation.checkString(req.body.firstName, 'first name');
        } catch (e) {
            response['firstName'.concat('Error')] = e;
        }
    }
    if ('lastName' in req.body) {
        try {
            req.body.lastName = validation.checkString(req.body.lastName, 'last name');
        } catch (e) {
            response['lastName'.concat('Error')] = e;
        }
    }
    if ('email' in req.body) {
        try {
            req.body.email = validation.checkEmail(req.body.email);
            if (await userData.getUserByEmail(req.body.email)) throw 'Email is in use.';
        } catch (e) {
            response['email'.concat('Error')] = e;
        }
    }
    res.json(response);
});

router.get('/publish', async (req, res) => {
    if (req.session.user) {
        res.render('partials/publish', {user: req.session.user});
    } else {
        res.redirect('/login');
    }
});

router.post('/publish', async (req, res) => {
    let response = {errors: {}};
    if ('movieId' in req.body) {
        try {
            req.body.movieId = validation.checkString(req.body.movieId, 'movie');
            const movie = await movieData.getMovie(req.body.movieId);
        } catch (e) {
            response.errors['movieId'] = e;
        }
    }
    if ('title' in req.body) {
        try {
            req.body.title = validation.checkString(req.body.title, 'review title');
        } catch (e) {
            response.errors['title'] = e;
        }
    }
    if ('content' in req.body) {
        try {
            req.body.content = validation.checkString(req.body.content, 'review body');
        } catch (e) {
            response.errors['content'] = e;
        }
    }
    if ((Object.keys(req.body).length < 4) || (Object.keys(response.errors).length > 0)) {
        res.json(response);
    } else {
        try {
            const review = await reviewData.createReview(req.session.user, req.body.movieId, req.body.title, req.body.content, req.body.rating);
            if (review.id) {
                response.reviewId = review.id;
                // TODO: Redirect to review page instead.
                // res.status(200).redirect('/home');
                res.json(response);
            } else {
                // TODO: Complete
                res.json({error: 'Internal Server Error'});
            }
        } catch (e) {
            // TODO: Complete
            res.json({error: e});
        }
    }
});

router.get('/settings', async (req, res) => {
    if (req.session.user) {
        try {
            const user = await userData.getUser(req.session.user)
            res.render('partials/settings', {user: user});
        } catch (e) {
            // TODO: Implement non-JSON response
            res.json({error: "Something went wrong..."});
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/settings', async (req, res) => {
    let response = {};
    if ('username' in req.body) {
        try {
            req.body.username = validation.checkUsername(req.body.username);
            if (await userData.getUserByUsername(req.body.username)) throw 'Username is taken.';
        } catch (e) {
            response.error = e;
        }
    } else if ('password' in req.body) {
        try {
            req.body.password = validation.checkPassword(req.body.password);
        } catch (e) {
            response.error = e;
        }
        try {
            req.body.confirmPassword = await userData.confirmPassword(req.body.password, req.body.confirmPassword, false);
        } catch (e) {
            response.secondaryError = e;
        }
    } else if ('firstName' in req.body) {
        try {
            req.body.firstName = validation.checkString(req.body.firstName, 'first name');
        } catch (e) {
            response.error = e;
        }
    } else if ('lastName' in req.body) {
        try {
            req.body.lastName = validation.checkString(req.body.lastName, 'last name');
        } catch (e) {
            response.error = e;
        }
    } else if ('email' in req.body) {
        try {
            req.body.email = validation.checkEmail(req.body.email);
            if (await userData.getUserByEmail(req.body.email)) throw 'Email is in use.';
        } catch (e) {
            response.error = e;
        }
    }
    if ((Object.keys(response).length > 0) || req.body.stopSubmission === true) {
        res.json(response);
    } else {
        try {
            if ('username' in req.body) {
                userData.updateUsername(req.session.user, req.body.username);
            } else if ('password' in req.body) {
                userData.updatePassword(req.session.user, req.body.password);
            } else if ('firstName' in req.body) {
                userData.updateFirstName(req.session.user, req.body.firstName);
            } else if ('lastName' in req.body) {
                userData.updateLastName(req.session.user, req.body.lastName);
            } else if ('email' in req.body) {
                userData.updateEmail(req.session.user, req.body.email);
            } 
            res.json(response);
            // res.redirect('/settings');
        } catch (e) {
            // TODO: Render this properly
            res.json({error: e});
        }
    }
});

// ALL ROUTES PREPENDED WITH "test" ARE EXCLUSIVELY FOR TESTING PURPOSES AND WILL BE REMOVED!





module.exports = router;