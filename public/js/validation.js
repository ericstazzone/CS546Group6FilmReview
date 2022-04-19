$(document).ready(function() {    
    let loginForm = $('#login-form');
    let signupForm = $('#signup-form');

    loginForm.submit(function(event) {
        if (!loginForm[0].checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        loginForm.addClass('was-validated');
    });

    signupForm.submit(function(event) {
        if (!signupForm[0].checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        signupForm.addClass('was-validated');
    });
});