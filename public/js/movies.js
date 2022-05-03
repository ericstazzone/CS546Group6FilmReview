$(document).ready(function() {
    var req;

    $(document).on('input', '.bs-searchbox input', function(event) {
        const term = $(this).val();
        
        if (req) req.abort();
        $('#movie-search').empty();
        $('.selectpicker').selectpicker('refresh');
       
        req = $.get(`https://imdb-api.com/en/API/SearchMovie/k_3f3tgnu1/${term}`, function(data, status) {
            let results = [];
            $.each(data.results, function(_, movie) {
                results.push(movie);
            });
            
            for (const movie of results) $('#movie-search').append(`<option value="${movie.id}" data-subtext="${movie.description.match(/\(\d{4}\)/g) || ''}">${movie.title}</option>`);
            $('.selectpicker').selectpicker('refresh');
        });
    });
});