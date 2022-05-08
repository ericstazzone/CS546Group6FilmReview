function styleReviewInput(label, input, errorDiv, errorMsg) {
    if (input.attr('name') === 'movieId') input = input.parent();
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
    let publishForm = $('#publish-form');
    let validated = false;

    let publishFields = [];
    $('.publish-group').each(function(index) {
        let field = {
            label: $(this).children('label').first(),
            input: $(this).find(':input').first(),
            error: $(this).children('.invalid-feedback').first()
        };
        publishFields.push(field);
    });

    function validateReview(field) {
        // CLIENT-SIDE

        let fields = field ? [field] : publishFields;
        let validateFields = [];
        for (const field of fields) {
            let input = field.input;
            try {
                if (input.attr('name') === 'movieId') {
                    checkString(input.val(), 'movie');
                } else if (input.attr('name') === 'title') {
                    checkString(input.val(), 'review title');
                } else if (input.attr('name') === 'content') {
                    checkString(input.val(), 'review body');
                }
                validateFields.push(field);
            } catch (e) {
                styleReviewInput(field.label, field.input, field.error, e);
            }
        }

        // AJAX

        let data = {};
        for (const f of validateFields) {
            data[f.input.attr('name')] = f.input.val();
        }
    
        var requestConfig = {
            method: 'POST',
            url: '/publish',
            contentType: 'application/json',
            data: JSON.stringify(data)
        };
    
        $.ajax(requestConfig).then(function(data) {
            if ((Object.keys(data.errors).length === 0) && (Object.keys(validateFields).length === Object.keys(publishFields).length)) {
                if (field) {
                    styleReviewInput(field.label, field.input, field.error);
                } else {
                    for (const f of publishFields) {
                        styleReviewInput(f.label, f.input, f.error);
                    }
                }
                if ('reviewId' in data) {
                    window.location.replace(`reviews/${data.reviewId}`);
                }
            } else {
                for (const field of validateFields) {
                    if (field.input.attr('name') in data.errors) {
                        styleReviewInput(field.label, field.input, field.error, data.errors[field.input.attr('name')]);
                    } else {
                        styleReviewInput(field.label, field.input, field.error);
                    }
                }
            }
        });
    }

    // Only perform real-time validation if the form has already been validated once
    for (const field of publishFields) {
        if (field.input.is('select')) {
            field.input.on('change', function() {
                if (validated) {
                    validateReview(field);
                }
            });
        } else {
            field.input.on('input', function() {
                if (validated) {
                    validateReview(field);
                }
            });
        }
    }

    publishForm.submit(function(event) {
        event.preventDefault();

        validated = true;
        validateReview();
    });
});