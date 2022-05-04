const emailValidator = require('email-validator');
const { ObjectId } = require('mongodb');

function checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'Error: id cannot be an empty string or just spaces';
    // TODO: Adjust line to check for necessary format
    if (!ObjectId.isValid(id)) throw 'Error: Invalid ObjectId';
    return id;
}

function checkString(string, parameter) {
    if (!string || typeof string != 'string' || string.trim().length == 0) throw `Please enter your ${parameter}.`;
    return string.trim();
}

// Throws an error if the provided username is taken or it does not meet every requirement
function checkUsername(username) {
    checkString(username, 'username');

    // Check if username contains any illegal characters
    if (!/^[a-zA-Z0-9]+$/g.test(username)) throw 'Username contains illegal characters.';
    // Check if username is of sufficient length
    if (username.length < 8) throw 'Username must be at least 8 characters long.';
    return username;
}

// Throws an error if the provided password does not meet every requirement
function checkPassword(password) {
    checkString(password, 'password');
    
    // Check if password contains any illegal characters
    if (/\s/g.test(password)) throw 'Password contains illegal characters.';
    // Check if password is of sufficient length
    if (password.length < 8) throw 'Password must be at least 8 characters long.';
    return password;
}

function confirmPassword(password1, password2) {
    checkString(password2, 'password');
    if (password1 !== password2) throw 'Password fields must match.';
    return password2;
}

function checkEmail(email) {
    checkString(email, 'email');
    if (!emailValidator.validate(email)) throw "Email is invalid.";
    return email;
}

function checkKeyword(keyword){
    keyword = checkString(keyword, 'keyword');
    if (keyword != "Title" || keyword != "Director" || keyword != "Actor" || keyword != "Release Date" || keyword != "Reviewer") throw "Keyword is invalid.";
    return keyword;
}

function checkSearchTerm(searchTerm){
    if(searchTerm){
        if(typeof string != 'string' || string.trim().length == 0){ throw 'Search term is invalid';} //search term exists make sure it is correct type and not just spaces
        return searchTerm.trim();
    } else {
        return searchTerm //empty search term is valid
    }   
}

module.exports = {
    checkId,
    checkString,
    checkUsername,
    checkPassword,
    confirmPassword,
    checkEmail,
    checkKeyword,
    checkSearchTerm
}