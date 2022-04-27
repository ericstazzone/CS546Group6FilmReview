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
    let loginForm = $('#login-form');
    let loginFields = [];
    $('.login-group').each(function(index) {
        loginFields.push({
            label: $(this).children('label').first(),
            input: $(this).children('input').first(),
            error: $(this).children('div').first()
        });
        let input = loginFields[index].input;
        input.on('input', (function() {
            // Only perform real-time validation if the form has the class 'validated'
            if (loginForm.hasClass('validated')) {
                // alert(input.val());

                var requestConfig = {
                    method: 'POST',
                    url: '/validate',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      [input.attr('name')]: input.val()
                    })
                };
                
                $.ajax(requestConfig).then(function(data) {      
                    styleInput(loginFields[index], data[input.attr('name').concat('Error')]);
                });
            }
        }));
    });
    
    let signupForm = $('#signup-form');

    loginForm.submit(function(event) {
        let data = {};
        for (const field of loginFields) {
            data[field.input.attr('name')] = field.input.val();
        }

        var requestConfig = {
            method: 'POST',
            url: '/validate',
            contentType: 'application/json',
            data: JSON.stringify(data)
        };

        $.ajax(requestConfig).then(function(data) {  
            for (const field of loginFields) {
                styleInput(field, data[field.input.attr('name').concat('Error')]);
            }    
        });

        // if (!loginForm[0].checkValidity()) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        event.preventDefault();
        event.stopPropagation();

        loginForm.addClass('validated');
    });

    // signupForm.submit(function(event) {
    //     if (!signupForm[0].checkValidity()) {
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }
    //     signupForm.addClass('was-validated');
    // });
});