(function ($) {
    window.onload = function(){ //on page load function
        var requestConfig = { //make request to /reviews route for all reviews
            method: 'POST',
            url: '/reviews'
        };
        $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server
            for(let item of responseData.reviewAndMovieTitlesList){ //append all shows to showList ul element
                console.log('Test');
                let li = `<button class="list-group-item list-group-item-action" type="button">${item.reviewTitle}<br><small class="font-italic">${item.movieTitle}</small></button>`;
                $('#reviewList').append(li);
            }
        });
    };

})(window.jQuery);