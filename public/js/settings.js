function styleInput(label, input, errorDiv, errorMsg) {
    if (errorMsg) {
        errorDiv.text(errorMsg);
        label.removeClass('text-success');
        label.addClass('text-danger');
        input.removeClass('is-valid');
        input.addClass('is-invalid');
    } else {
        label.removeClass('text-danger');
        label.addClass('text-success');
        input.removeClass('is-invalid');
        input.addClass('is-valid');
    }
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

$(document).ready(function() {
    let settingsForm = $('#settings-form');

    let firstNameGroup = $('#first-name-group');
    let lastNameGroup = $('#last-name-group');
    let emailGroup = $('#email-group');
    let usernameGroup = $('#username-group');
    let passwordGroup = $('#password-group');

    let completeButton = $('#complete-button');
    let submitButton = $('#submit-button');
    let cancelButton = $('#cancel-button');
    submitButton.hide();
    cancelButton.hide();

    let passwordLabel = passwordGroup.children('label');
    let passwordInput = passwordGroup.find('input');
    let passwordErrorDiv = passwordGroup.find('.invalid-feedback');

    let confirmPasswordGroup = $('#confirm-password-group');
    let confirmPasswordLabel = confirmPasswordGroup.children('label');
    let confirmPasswordInput = confirmPasswordGroup.children('input');
    let confirmPasswordErrorDiv = confirmPasswordGroup.children('.invalid-feedback');
    confirmPasswordGroup.hide();

    $('.form-group button').click(function(event) {
        event.preventDefault();

        let button = $(this);
        let group = button.closest('.form-group');
        let label = group.children('label');
        let inputGroup = group.children('.input-group');
        let inputGroupPrepend = button.parent();
        let input = inputGroup.children('input');
        let errorDiv = inputGroup.children('.invalid-feedback');

        let current = input.val();
        let validated = false;

        // Remove all other fields
        $('.form-group').each(function() {
            if (!$(this).is(group)) {
                if ((input.attr('name') === 'password') && $(this).is(confirmPasswordGroup)) return;
                $(this).remove();
            }
        });

        // Format chosen field
        inputGroupPrepend.remove();
        input.removeAttr('readonly');
        input.prop('required', true);
        completeButton.hide();
        submitButton.show();
        cancelButton.show();

        // Show confirm password field
        if (input.attr('name') === 'password') {
            confirmPasswordInput.removeAttr('disabled');
            confirmPasswordInput.prop('required', true);
            confirmPasswordGroup.show();
        }

        function validate(stopSubmission) {
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
                    let passwordErrors = 0;
                    try {
                        checkPassword(passwordInput.val());
                    } catch (e) {
                        passwordErrors++;
                        styleInput(passwordLabel, passwordInput, passwordErrorDiv, e);
                    }
                    try {
                        confirmPassword(passwordInput.val(), confirmPasswordInput.val());
                    } catch (e) {
                        passwordErrors++;
                        styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv, e);
                    }
                    cancelValidation = (passwordErrors === 2);
                }
            } catch (e) {
                styleInput(label, input, errorDiv, e);
                cancelValidation = true;
            }     

            // AJAX

            if (!cancelValidation) {
                if ((input.attr('name') !== 'password') && (input.val() === current)) {
                    styleInput(label, input, errorDiv);
                } else {
                    let data = {
                        [input.attr('name')]: input.val(),
                        stopSubmission: stopSubmission
                    };
                    if (input.attr('name') === 'password') data[confirmPasswordInput.attr('name')] = confirmPasswordInput.val();
    
                    var requestConfig = {
                        method: 'POST',
                        url: '/settings',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    };
                    
                    $.ajax(requestConfig).then(function(data) {
                        if (('error' in data) || ('secondaryError' in data)) {
                            data.error ? styleInput(label, input, errorDiv, data.error) : styleInput(label, input, errorDiv);
                            data.secondaryError ? styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv, data.secondaryError) : styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv);
                        } else {
                            if (stopSubmission) {
                                styleInput(label, input, errorDiv);
                                styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv);
                            } else if ('url' in data) {
                                window.location.replace(data.url);
                            }
                        }
                    });
                }
            }
        }

        input.on('input', function() {
            if (validated) {
                validate(true);
            }
        });
        if (input.attr('name') === 'password') {
            confirmPasswordInput.on('input', function() {
                if (validated) {
                    validate(true);
                }
            });
        }

        settingsForm.submit(function(event) {
            event.preventDefault();

            if ((input.attr('name') !== 'password') && (input.val() === current)) {
                window.location.replace('/settings');
            } else {
                validated = true;
                validate(false);
            }
        });
    });
});