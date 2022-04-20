$(document).ready(function() {    
    const container = $('#main-container');
    const login = $('#login');
    const signup = $('#signup');
    const loginLink = $('#login-link');
    const signupLink = $('#signup-link');
    const loginForm = $('#login-form');
    const signupForm = $('#signup-form');

    loginLink.click(function(event) {
        event.preventDefault();
        signup.attr('hidden', true);
        login.removeAttr('hidden');
        signupForm.removeClass('was-validated');
    });

    signupLink.click(function(event) {
        event.preventDefault();
        login.attr('hidden', true);
        signup.removeAttr('hidden');
        loginForm.removeClass('was-validated');
    });
});