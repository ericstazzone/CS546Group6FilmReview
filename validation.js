const emailValidator = require('email-validator');
const { ObjectId } = require('mongodb');

function checkId(id) {
    if (!id) throw 'You must provide an id to search for.';
    if (typeof id !== 'string') throw 'Id must be a string.';
    id = id.trim();
    if (id.length === 0) throw 'Id cannot be an empty string or just spaces.';
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId.';
    return id;
}

function checkString(string, parameter) {
    // Check if string is valid and nonempty
    if (!string || typeof string != 'string' || string.trim().length == 0) throw `Please enter your ${parameter}.`;
    return string.trim();
}

function checkUsername(username) {
    checkString(username, 'username');

    // Check if username contains any illegal characters
    if (!/^[a-zA-Z0-9]+$/g.test(username)) throw 'Username contains illegal characters.';
    // Check if username is of sufficient length
    if (username.length < 8) throw 'Username must be at least 8 characters long.';
    return username;
}

function checkPassword(password) {
    checkString(password, 'password');
    
    // Check if password contains any illegal characters
    if (/\s/g.test(password)) throw 'Password contains illegal characters.';
    // Check if password is of sufficient length
    if (password.length < 8) throw 'Password must be at least 8 characters long.';
    return password;
}

function checkEmail(email) {
    checkString(email, 'email');

    // Check if email is of proper format
    if (!emailValidator.validate(email)) throw "Email is invalid.";
    return email;
}

module.exports = {
    checkId,
    checkString,
    checkUsername,
    checkPassword,
    checkEmail
}