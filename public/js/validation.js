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

function validateForm() {
    let string = document.forms["commentForm"]["comment"].value;

    //console.log("String is: "+string)

    if (!string || typeof string != 'string' || string.trim().length == 0){
        alert("Invalid Comment String");
        return false;
    }
}

function checkString(string, parameter) {
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
    let loginSuccess = false;
    // loginForm.submit(function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     toggleForm(loginForm);


    //     if (!loginForm[0].checkValidity()) {
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }
    //     loginForm.addClass('was-validated');
    // });

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
        if (!loginSuccess) {
            event.preventDefault();
            event.stopPropagation();

            let cancelValidation = false;
            $('.login-group').each(function(index) {
                let input = loginFields[index].input;
                let label = loginFields[index].label;

                if (input.val().trim().length === 0) {
                    label.addClass('text-danger');
                    input.addClass('is-invalid');
                    loginAlert.attr('hidden', true);
                    loginForm.addClass('validated');
                    cancelValidation = true;
                } else {
                    label.removeClass('text-danger');
                    input.removeClass('is-invalid');
                }
            });
            if (!cancelValidation) {
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
                    url: '/loginValidation',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        username: $('#login-username').val(),
                        password: $('#login-password').val()
                    })
                };

                $.ajax(requestConfig).then(function(data) {
                    if (!('error' in data)) {
                        loginSuccess = true;
                        toggleAlert(loginAlert, true, 'You have been signed in!');
                        loginForm.submit();
                    } else {
                        toggleForm(loginForm);
                        toggleAlert(loginAlert, false, data.error);
                        loginForm.addClass('validated');
                    }
                });
            }
        }
    });
    
    let signupForm = $('#signup-form');
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
                    } else if (input.attr('name') === 'password') {
                        checkPassword(input.val());
                    } else if (input.attr('name') === 'confirmPassword') {
                        confirmPassword($('#signup-password').val(), input.val());
                    }
                } catch (e) {
                    styleInputSignUp(signupFields[index], e);
                    cancelValidation = true;
                }                

                // AJAX

                if (!cancelValidation) {
                    let data = {
                        [input.attr('name')]: input.val()
                    };
                    // Pass through both password fields whenever one is updated
                    if (input.attr('name') === 'password') {
                        data['confirmPassword'] = $('#confirm-password').val();
                    } else if (input.attr('name') === 'confirmPassword') {
                        data['password'] = $('#signup-password').val();
                    }
    
                    var requestConfig = {
                        method: 'POST',
                        url: '/signupValidation',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    };
                    
                    $.ajax(requestConfig).then(function(data) {      
                        styleInputSignUp(signupFields[index], data[input.attr('name').concat('Error')]);
                        if (input.attr('name') === 'password') {
                            styleInputSignUp(signupFields.find(field => field.input.attr('name') === 'confirmPassword'), data['confirmPasswordError']);
                        }
                    });
                }
            }
        }));
    });

    let signupSuccess = false;
    signupForm.submit(function(event) {
        if (!signupSuccess) {
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

            let data = {};
            for (const field of validateFields) {
                data[field.input.attr('name')] = field.input.val();
            }

            var requestConfig = {
                method: 'POST',
                url: '/signupValidation',
                contentType: 'application/json',
                data: JSON.stringify(data)
            };

            $.ajax(requestConfig).then(function(data) {
                if ((Object.keys(data).length === 0) && (Object.keys(validateFields).length === Object.keys(signupFields).length)) {
                    signupSuccess = true;
                    signupForm.submit();
                } else {
                    for (const field of validateFields) {
                        styleInputSignUp(field, data[field.input.attr('name').concat('Error')]);
                    }
                    signupForm.addClass('validated');
                }
            });
        }
    });
});