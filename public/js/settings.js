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

    let submitButton = $('#submit-button');
    let cancelButton = $('#cancel-button');

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
        cancelButton.prop('href', 'settings');

        function validate(stopSubmission) {
            if (input.val() === current) {
                styleInput(label, input, errorDiv);
            } else {
                var requestConfig = {
                    method: 'POST',
                    url: '/settings',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        [input.attr('name')]: input.val(),
                        stopSubmission: stopSubmission
                    })
                };
    
                $.ajax(requestConfig).then(function(data) {
                    if (data.error) {
                        styleInput(label, input, errorDiv, data.error);
                    } else {
                        if (stopSubmission) {
                            styleInput(label, input, errorDiv);
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

        settingsForm.submit(function(event) {
            event.preventDefault();

            if (input.val() === current) {
                window.location.replace('settings');
            } else {
                validated = true;
                validate(false);
            }
        });
    });
});