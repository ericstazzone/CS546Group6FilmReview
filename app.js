const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(session({
    name: 'AuthCookie',
    secret: 'top secret string',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log('The server is up!');
    console.log('Your routes are running on http://localhost:3000');
});