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

        // Hide all other fields
        $('.form-group').each(function() {
            if (!$(this).is(group)) {
                $(this).hide();
                $(this).find('input').prop('disabled', true);
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
            if ((input.attr('name') !== 'password') && (input.val().toLowerCase() === current.toLowerCase())) {
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
                    if (Object.keys(data).length > 0) {
                        data.error ? styleInput(label, input, errorDiv, data.error) : styleInput(label, input, errorDiv);
                        data.secondaryError ? styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv, data.secondaryError) : styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv);
                    } else {
                        if (stopSubmission) {
                            styleInput(label, input, errorDiv);
                            styleInput(confirmPasswordLabel, confirmPasswordInput, confirmPasswordErrorDiv);
                        } else {
                            window.location.replace('settings');
                        }
                    }
                });
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

            if ((input.attr('name') !== 'password') && (input.val().toLowerCase() === current.toLowerCase())) {
                window.location.replace('settings');
            } else {
                validated = true;
                validate(false);
            }
        });
    });
});