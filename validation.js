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

function checkEmail(email) {
    checkString(email, 'email');
    if (!emailValidator.validate(email)) throw "Email is invalid.";
    return email;
}

function leapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
function checkValidDate(date){
    let splitSearchTerm = date.split("-");
    if(splitSearchTerm.length != 3){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check if there is the correct number of dashes
    let year = splitSearchTerm[0];
    let month = splitSearchTerm[1];
    let day = splitSearchTerm[2];
    
    if(year === 'null' || month === 'null' || day === 'null') {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (year.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (month.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (day.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(splitSearchTerm[0].length != 4){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for year
    if(splitSearchTerm[1].length != 2){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for month
    if(splitSearchTerm[2].length != 2){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for day
    year = Number(year);
    month = Number(month);
    day = Number(day);
    if(typeof year !== 'number' || isNaN(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(typeof month !== 'number' || isNaN(month)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(typeof day !== 'number' || isNaN(day)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}

    if(month < 1 || month > 12){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(day > 31 || day < 1) { throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(month === 4 || month === 6 || month === 9 || month === 11){
        if(day > 30){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    }
    if(month === 2 && day > 28 && !leapYear(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(month === 2 && day > 29 && leapYear(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
}

function checkKeyword(keyword){
    keyword = checkString(keyword, 'keyword');
    if (keyword != "Title" && keyword != "Director" && keyword != "Actor" && keyword != "Release Date" && keyword != "Reviewer") throw "Keyword is invalid.";
    return keyword;
}

function checkSearchTerm(searchTerm,keyword){
    if(searchTerm){
        if (!/^[a-zA-Z0-9\-]+$/g.test(searchTerm)) throw 'Search term contains illegal characters.';
        if(typeof searchTerm != 'string' || searchTerm.trim().length == 0){ throw 'Search term is invalid';} //search term exists make sure it is correct type and not just spaces
        searchTerm = searchTerm.trim();
        if(keyword == "Release Date"){ checkValidDate(searchTerm); } //validate that the user provides a data in the form of 2001-01-30
        return searchTerm;
    } else {
        return searchTerm //empty search term is valid
    }   
}

function checkRating(rating){
    if (!rating) {throw 'Error: You must provide a valid rating';}
    if (rating.trim().length === 0){throw 'Error: You must provide a valid rating';}
    rating = Number(rating);
    if(typeof rating !== 'number' || isNaN(rating)){throw 'Error: You must provide a valid rating';}
    if(rating < 1 || rating > 10){throw 'Error: You must provide a rating';}
    return rating;
}

function validateMovieData(movieData){
    if(!movieData){throw 'Error: Movie data was unable to be retrieved';}
    if(!movieData.title){ movieData.title = "";}
    if(!movieData.directorList){movieData.directorList = [];}
    if(!movieData.starList){movieData.starList = [];}
    if(!movieData.releaseDate){movieData.title = "";}
}

module.exports = {
    checkId,
    checkString,
    checkUsername,
    checkPassword,
    checkEmail,
    checkKeyword,
    checkSearchTerm,
    checkRating,
    validateMovieData
}