(function ($) {    
    $(document).ready(function() {    
        const sortButton = $('#sort-button');
        const sortMenu = $('#sort-menu');

        sortButton.text(sortMenu.children('a').first().text());
        sortButton.val(sortMenu.children('a').first().text());

        sortMenu.children('a').click(function(event) {
            event.preventDefault();
            sortButton.text($(this).text());
            sortButton.val($(this).text());
        });
            
        $('#reviewListRecent').show();
        $('#reviewListRecent').empty();
        var requestConfig = { //make request to /reviews route for all reviews
            method: 'GET',
            url: '/reviews/home',
        };
        $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server //**TO DO: Error message load instead of appending to list due to input/server error
            //recent
            for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.title}</medium> <br><small class="font-italic">${item.rating}</small><br> <small>${item.createdDate}</small></button>`;
                $('#reviewListRecent').append(li);
            }
        });
    });
})(window.jQuery);
