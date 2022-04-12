let signInBox = document.getElementById('login-box');
let signUpBox = document.getElementById('signup-box');
let signInLink = document.getElementById('login-link');
let signUpLink = document.getElementById('signup-link');
let signInButton = document.getElementById('login-button');
let signUpButton = document.getElementById('signup-button');

signInLink.addEventListener('click', () => {
    signUpBox.hidden = true;
    signInBox.hidden = false;
});

signUpLink.addEventListener('click', () => {
    signInBox.hidden = true;
    signUpBox.hidden = false;
});

signInButton.addEventListener('click', () => {

});

signUpButton.addEventListener('click', () => {

});