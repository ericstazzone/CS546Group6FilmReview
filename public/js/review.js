(function ($) {
    $(document).ready( function(){ //on page load function
        if($('#review-catalog').length){
            $('#reviewListRecent').show();
            $('#reviewListPopular').hide();
            $('#reviewListAlphabetical').hide();
            $('#reviewListRecent').empty();
            $('#reviewListPopular').empty();
            $('#reviewListAlphabetical').empty();
            var requestConfig = { //make request to /reviews route for all reviews
                method: 'POST',
                url: '/reviews',
                data: {
                    keyword:'Title',
                    searchTerm: ''
                }
            };
            $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server //**TO DO: Error message load instead of appending to list due to input/server error
                //recent
                for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                    let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                    $('#reviewListRecent').append(li);
                }

                //popular //**TODO: change order of review listing to be most popular to least 
                for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                    let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                    $('#reviewListPopular').append(li);
                }
                //alphabetical
                let reviewDisplayListAlphabetical = responseData.reviewDisplayInfo;
                reviewDisplayListAlphabetical.sort((a, b) => a.reviewTitle.localeCompare(b.reviewTitle)) //sort reviews alphabetically
                for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                    let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                    $('#reviewListAlphabetical').append(li);
                }
            });
        }
    });

    $('#searchForm').submit(function (event) {
        event.preventDefault();
        $('#reviewListRecent').hide();
        $('#reviewListPopular').hide();
        $('#reviewListAlphabetical').hide();
        $('#reviewListRecent').empty();
        $('#reviewListPopular').empty();
        $('#reviewListAlphabetical').empty();
        
        let userSearchTerm = $('#searchbar').val();
        let userKeyword = $('#keyword').find(":selected").text();
        if(!userSearchTerm){userSearchTerm='';}
        var requestConfig = { //make request to /reviews route for all reviews
            method: 'POST',
            url: '/reviews',
            data: JSON.stringify({ // **TODO clientside input checking
                keyword:userKeyword,
                searchTerm:userSearchTerm.toLowerCase()
            })
        };
        $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server
            
            //recent
            for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                $('#reviewListRecent').append(li);
            }

            //popular //**TODO: change order of review listing to be most popular to least 
            for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                $('#reviewListPopular').append(li);
            }
            //alphabetical
            let reviewDisplayListAlphabetical = responseData.reviewDisplayInfo;
            reviewDisplayListAlphabetical.sort((a, b) => a.reviewTitle.localeCompare(b.reviewTitle)) //sort reviews alphabetically
            for(let item of reviewDisplayListAlphabetical){ //append all shows to showList ul elemen
                let li = `<button class="list-group-item list-group-item-action" type="button"><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button>`;
                $('#reviewListAlphabetical').append(li);
            }
        });
        $('#reviewListRecent').show();
    });

    $("recent listing option").on("click", function (event) {
        event.preventDefault();
        $('#reviewListRecent').show();
        $('#reviewListPopular').hide();
        $('#reviewListAlphabetical').hide();
    });

    $("popular listing option").on("click", function (event) {
        event.preventDefault();
        $('#reviewListRecent').hide();
        $('#reviewListPopular').show();
        $('#reviewListAlphabetical').hide();
    });

    $("alphabetical listing option").on("click", function(event) {
        event.preventDefault();
        $('#reviewListRecent').hide();
        $('#reviewListPopular').hide();
        $('#reviewListAlphabetical').show();
    });
})(window.jQuery);