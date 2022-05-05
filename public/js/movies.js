$(document).ready(function() {
    var req;
    let term = '';
    let unselected = true;

    $('.selectpicker').on('shown.bs.select', function() {
        $('.bs-searchbox input').val(term);
    });

    $(document).on('input', '.bs-searchbox input', function(event) {
        if ($('.selectpicker').val()) unselected = false;

        term = $(this).val();
        
        if (req) req.abort();
        $('#movie-search').find('*').not($('.selectpicker').find("option:selected")).remove();
        $('.selectpicker').selectpicker('refresh');
       
        req = $.get(`https://imdb-api.com/en/API/SearchMovie/k_3f3tgnu1/${term}`, function(data, status) {
            let results = [];
            $.each(data.results, function(_, movie) {
                results.push(movie);
            });
            
            for (const movie of results) {
                if ($('.selectpicker').val() !== movie.id) $('#movie-search').append(`<option value="${movie.id}" data-subtext="${movie.description.match(/\(\d{4}\)/g) || ''}">${movie.title}</option>`);
            }
            if (unselected) $('.selectpicker').val(null);
            $('.selectpicker').selectpicker('refresh');
        });
    });
});