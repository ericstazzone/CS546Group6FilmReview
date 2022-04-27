// window.onerror = function (msg, source, lineNo, columnNo, error) {
//     alert(msg);
// }

function styleInput(field, errorMsg) {
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

$(document).ready(function() {    
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
                    url: '/validate',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                };
                
                $.ajax(requestConfig).then(function(data) {      
                    styleInput(signupFields[index], data[input.attr('name').concat('Error')]);
                    if (input.attr('name') === 'password') {
                        styleInput(signupFields.find(field => field.input.attr('name') === 'confirmPassword'), data['confirmPasswordError']);
                    }
                });
            }
        }));
    });

    let signupSuccess = false;
    signupForm.submit(function(event) {
        if (!signupSuccess) {
            event.preventDefault();
            event.stopPropagation();

            let data = {};
            for (const field of signupFields) {
                data[field.input.attr('name')] = field.input.val();
            }

            var requestConfig = {
                method: 'POST',
                url: '/validate',
                contentType: 'application/json',
                data: JSON.stringify(data)
            };

            $.ajax(requestConfig).then(function(data) {
                if (Object.keys(data).length === 0) {
                    signupSuccess = true;
                    signupForm.submit();
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    for (const field of signupFields) {
                        styleInput(field, data[field.input.attr('name').concat('Error')]);
                    }
                    signupForm.addClass('validated');
                }
            });
        }
    });

    // signupForm.submit(function(event) {
    //     if (!signupForm[0].checkValidity()) {
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }
    //     signupForm.addClass('was-validated');
    // });
});