(function ($) {
    $(document).ready( function(){ //on page load function
        $('#hiddeninfo').hide();
        if($('#review-catalog').length){
            $('#reviewListRecent').show();
            $('#reviewListPopular').hide();
            $('#reviewListAlphabetical').hide();
            $('#reviewListRecent').empty();
            $('#reviewListPopular').empty();
            $('#reviewListAlphabetical').empty();
            let reviewDisplayInfo = JSON.parse($('#hiddeninfo').text());
            for(let item of reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListRecent').append(li);
            }
            //popular //**TODO: change order of review listing to be most popular to least 
            for(let item of reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListPopular').append(li);
            }
            //alphabetical
            let reviewDisplayListAlphabetical = reviewDisplayInfo;
            reviewDisplayListAlphabetical.sort((a, b) => a.reviewTitle.localeCompare(b.reviewTitle)) //sort reviews alphabetically
            for(let item of reviewDisplayListAlphabetical){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListAlphabetical').append(li);
            }
            $('#reviewListRecent').show();
            $('#recentlistingoption').trigger('click');
        }
    });

    // $('#searchForm').submit(function (event) {
    //     // if($('#review-catalog').length){ //submit form event listener for review catalog page
    //     //     event.preventDefault();
    //     //     $('#reviewListRecent').hide();
    //     //     $('#reviewListPopular').hide();
    //     //     $('#reviewListAlphabetical').hide();
    //     //     $('#reviewListRecent').empty();
    //     //     $('#reviewListPopular').empty();
    //     //     $('#reviewListAlphabetical').empty();
            
    //     //     let userSearchTerm = $('#searchbar').val();
    //     //     let userKeyword = $('#keyword').find(":selected").text();
    //     //     if(!userSearchTerm){userSearchTerm='';}
    //     //     var requestConfig = { //make request to /reviews route for all reviews
    //     //         method: 'POST',
    //     //         url: '/reviews',
    //     //         data: { // **TODO clientside input checking
    //     //             keyword:userKeyword,
    //     //             searchTerm:userSearchTerm.toLowerCase()
    //     //         }
    //     //     };
    //     //     $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server
    //     //         //recent
    //     //         for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
    //     //             let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
    //     //             $('#reviewListRecent').append(li);
    //     //         }

    //     //         //popular //**TODO: change order of review listing to be most popular to least 
    //     //         for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
    //     //             let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
    //     //             $('#reviewListPopular').append(li);
    //     //         }
    //     //         //alphabetical
    //     //         let reviewDisplayListAlphabetical = responseData.reviewDisplayInfo;
    //     //         reviewDisplayListAlphabetical.sort((a, b) => a.reviewTitle.localeCompare(b.reviewTitle)) //sort reviews alphabetically
    //     //         for(let item of reviewDisplayListAlphabetical){ //append all shows to showList ul elemen
    //     //             let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
    //     //             $('#reviewListAlphabetical').append(li);
    //     //         }
    //     //     });
    //     //     $('#reviewListRecent').show();
    //     //     $('#recentlistingoption').trigger('click');
    //     // } else { //submitted form page that is not the review catalog page
    //     // }
    //     // event.preventDefault();
    //     // let userSearchTerm = $('#searchbar').val();
    //     // let userKeyword = $('#keyword').find(":selected").text();
    //     // if(!userSearchTerm){userSearchTerm='';}
    //     // var requestConfig = { //make request to /reviews route for all reviews
    //     //     method: 'POST',
    //     //     url: '/reviews',
    //     //     data: { // **TODO clientside input checking
    //     //         keyword:userKeyword,
    //     //         searchTerm:userSearchTerm.toLowerCase()
    //     //     }
    //     // };
    //     // $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server
    //     //     console.log("Rendered Review Catalog Page");
    //     // });
    // });

    $("#sort-menu").children().click(function(event) {
            event.preventDefault();
            $("#sort-button").text($(this).text());
            $("#sort-button").val($(this).text());
            if($("#sort-button").val() == "Recent"){
                $('#reviewListRecent').show();
                $('#reviewListPopular').hide();
                $('#reviewListAlphabetical').hide();
            } else if($("#sort-button").html() == "Popular"){
                $('#reviewListRecent').hide();
                $('#reviewListPopular').show();
                $('#reviewListAlphabetical').hide();
            } else if($("#sort-button").html() == "A-Z"){
                $('#reviewListRecent').hide();
                $('#reviewListPopular').hide();
                $('#reviewListAlphabetical').show();
            }
    });
})(window.jQuery);