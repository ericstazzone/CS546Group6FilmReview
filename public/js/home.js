(function ($) {    
    $(document).ready(function() {  
        $('#reviewListHomeRecent').show();
        $('#reviewListHomeRecent').empty();
        $('#reviewListHomePopular').show();
        $('#reviewListHomePopular').empty();
        var requestConfig = { //make request to /reviews route for all reviews
            method: 'GET',
            url: '/reviews/home',
        };
        $.ajax(requestConfig).then(function (responseData) { //ajax request to get all reviews from server //**TO DO: Error message load instead of appending to list due to input/server error
            //recent
            for(let item of responseData.reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<li> <a class="list-group-item list-group-item-action" href="/reviews/${item.reviewId}" target="_blank"> <span class="medium">${item.reviewTitle}</span> <br><span class="font-italic small">${item.movieTitle}</span></br> <span class="small">${item.reviewerName}</span></div></li>`;                    
                $('#reviewListHomeRecent').append(li);
            }
            
            //popular
            let reviewDisplayListPopular = responseData.reviewDisplayInfo;
            reviewDisplayListPopular.sort((a, b) => { return b.counter - a.counter; });
            for(let item of reviewDisplayListPopular){ //append all shows to showList ul elemen
                let li = `<li> <a class="list-group-item list-group-item-action" href="/reviews/${item.reviewId}" target="_blank"> <span class="medium">${item.reviewTitle}</span> <br><span class="font-italic small">${item.movieTitle}</span></br> <span class="small">${item.reviewerName}</span></div></li>`;                    
                $('#reviewListHomePopular').append(li);
            }
        });
    });
})(window.jQuery);
