function styleInputSignUp(field, errorMsg) {
    if (errorMsg) {
        field.error.text(errorMsg);
        field.label.removeClass('text-success');
        field.label.addClass('text-danger');
        field.input.removeClass('is-valid');
        field.input.addClass('is-invalid');
    } else {
        field.label.removeClass('text-danger');
        field.label.addClass('text-success');
        field.input.removeClass('is-invalid');
        field.input.addClass('is-valid');
    }
}

function toggleAlert(alert, success, message) {
    alert.text(message);
    if (success) {
        alert.removeClass('alert-danger');
        alert.addClass('alert-success');
    } else {
        alert.removeClass('alert-success');
        alert.addClass('alert-danger');
    }
    alert.removeAttr('hidden');
}

function toggleForm(form) {
    form.find('input').each(function(index) {
        if ($(this).is(':read-only')) {
            $(this).removeAttr('readonly');
        } else {
            $(this).prop('readonly', 'readonly');
        }
    });
    form.find('button').each(function(index) {
        if ($(this).is(':disabled')) {
            $(this).prop('disabled', false);
        } else {
            $(this).prop('disabled', true);
        }
    });
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

function confirmPassword(password1, password2) {
    password2 = checkPassword(password2);

    if (password1 !== password2) throw 'Password fields must match.';
    
    return password2;
}

function checkUserLogin(username, password) {
    let errors = {};
    try {
        username = checkUsername(username);
    } catch (e) {
        errors.usernameError = e;
    }
    try {
        password = checkPassword(password);
    } catch (e) {
        errors.passwordError = e;
    }
    return errors;
}

$(document).ready(function() {
    let loginForm = $('#login-form');
    let loginAlert = $('#login-alert');

    let loginFields = [];
    $('.login-group').each(function(index) {
        loginFields.push({
            label: $(this).children('label').first(),
            input: $(this).children('input').first(),
            error: $(this).children('div').first()
        });
        let input = loginFields[index].input;
        let label = loginFields[index].label;
        input.on('input', (function() {
            // Only perform real-time validation if the form has the class 'validated'
            if (loginForm.hasClass('validated')) {
                if (input.val().trim().length === 0) {
                    label.addClass('text-danger');
                    input.addClass('is-invalid');
                } else {
                    label.removeClass('text-danger');
                    input.removeClass('is-invalid');
                }
            }
        }));
    });

    loginForm.submit(function(event) {
        event.preventDefault();
        event.stopPropagation();

        let cancelValidation = false;
        $('.login-group').each(function(index) {
            let input = loginFields[index].input;
            let label = loginFields[index].label;

            if (input.val().trim().length === 0) {
                label.addClass('text-danger');
                input.addClass('is-invalid');
                loginForm.addClass('validated');
                cancelValidation = true;
            } else {
                label.removeClass('text-danger');
                input.removeClass('is-invalid');
            }
        });
        if (!cancelValidation) {
            loginAlert.attr('hidden', true);
            let errors = checkUserLogin($('#login-username').val(), $('#login-password').val());
            if (Object.keys(errors).length > 0) {
                toggleAlert(loginAlert, false, 'Either the username or password is invalid.');
                cancelValidation = true;
            }
        }

        if (!cancelValidation) {
            toggleForm(loginForm);

            var requestConfig = {
                method: 'POST',
                url: '/login',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: $('#login-username').val(),
                    password: $('#login-password').val()
                })
            };

            $.ajax(requestConfig).then(function(data) {
                if ('error' in data) {
                    toggleAlert(loginAlert, false, data.error);
                    loginForm.addClass('validated');
                    toggleForm(loginForm);
                } else if ('url' in data) {
                    // toggleAlert(loginAlert, true, 'You have been signed in!');
                    window.location.replace(data.url);
                }
            });
        }
    });
    
    let signupForm = $('#signup-form');
    let signupAlert = $('#signup-alert');
    let signupFields = [];
    $('.signup-group').each(function(index) {
        signupFields.push({
            label: $(this).children('label').first(),
            input: $(this).children('input').first(),
            error: $(this).children('div').first()
        });
        let input = signupFields[index].input;
        input.on('input', (function() {
            // Only perform real-time validation if the form has the class 'validated'
            if (signupForm.hasClass('validated')) {
                // CLIENT-SIDE

                let validateFields = [];
                let cancelValidation = false;
                try {
                    if (input.attr('name') === 'firstName') {
                        checkString(input.val(), 'first name');
                    } else if (input.attr('name') === 'lastName') {
                        checkString(input.val(), 'last name');
                    } else if (input.attr('name') === 'email') {
                        checkString(input.val(), 'email');
                    } else if (input.attr('name') === 'username') {
                        checkUsername(input.val());
                    }
                    validateFields.push(signupFields[index]);
                } catch (e) {
                    styleInputSignUp(signupFields[index], e);
                }
                if ((input.attr('name') === 'password') || (input.attr('name') === 'confirmPassword')) {
                    validateFields.push(signupFields[signupFields.length - 2]);
                    validateFields.push(signupFields[signupFields.length - 1]);
                }
                if (validateFields.length === 0) cancelValidation = true;
                
                // AJAX

                if (!cancelValidation) {
                    signupAlert.attr('hidden', true);
                    let data = {};
                    for (const field of validateFields) {
                        data[field.input.attr('name')] = field.input.val();
                    }

                    if (input.attr('name') === 'password') {
                        data['confirmPassword'] = $('#confirm-password').val();
                    }
    
                    var requestConfig = {
                        method: 'POST',
                        url: '/signup',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    };
                    
                    $.ajax(requestConfig).then(function(data) {
                        for (const field of validateFields) {
                            styleInputSignUp(field, data.error[field.input.attr('name')]);
                        }
                    });
                }
            }
        }));
    });

    signupForm.submit(function(event) {
        event.preventDefault();
        event.stopPropagation();

        // CLIENT-SIDE

        let validateFields = [];
        for (const field of signupFields) {
            let input = field.input;
            try {
                if (input.attr('name') === 'firstName') {
                    checkString(input.val(), 'first name');
                } else if (input.attr('name') === 'lastName') {
                    checkString(input.val(), 'last name');
                } else if (input.attr('name') === 'email') {
                    checkString(input.val(), 'email');
                } else if (input.attr('name') === 'username') {
                    checkUsername(input.val());
                } else if (input.attr('name') === 'password') {
                    checkPassword(input.val());
                } else if (input.attr('name') === 'confirmPassword') {
                    confirmPassword($('#signup-password').val(), input.val());
                }
                validateFields.push(field);
            } catch (e) {
                styleInputSignUp(field, e);
            }
        }

        // AJAX

        toggleForm(signupForm);

        signupAlert.attr('hidden', true);
        let data = {};
        for (const field of validateFields) {
            data[field.input.attr('name')] = field.input.val();
        }
        if (Object.keys(validateFields).length === Object.keys(signupFields).length) data.submit = true;

        var requestConfig = {
            method: 'POST',
            url: '/signup',
            contentType: 'application/json',
            data: JSON.stringify(data)
        };

        $.ajax(requestConfig).then(function(data) {
            if ('url' in data) {
                window.location.replace(data.url);
            } else {
                for (const field of validateFields) {
                    styleInputSignUp(field, data.error[field.input.attr('name')]);
                }
                if ('other' in data.error) toggleAlert(signupAlert, false, data.error.other);
                signupForm.addClass('validated');
                toggleForm(signupForm);
            }
        });
    });
});