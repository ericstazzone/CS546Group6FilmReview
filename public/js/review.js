function leapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
function checkValidDate(date){
    let splitSearchTerm = date.split("-");
    if(splitSearchTerm.length != 3){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check if there is the correct number of dashes
    let year = splitSearchTerm[0];
    let month = splitSearchTerm[1];
    let day = splitSearchTerm[2];
    
    if(year === 'null' || month === 'null' || day === 'null') {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (year.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (month.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if (day.trim().length === 0) {throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(splitSearchTerm[0].length != 4){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for year
    if(splitSearchTerm[1].length != 2){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for month
    if(splitSearchTerm[2].length != 2){throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";} //check for correct number of digits for day
    year = Number(year);
    month = Number(month);
    day = Number(day);
    if(typeof year !== 'number' || isNaN(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(typeof month !== 'number' || isNaN(month)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(typeof day !== 'number' || isNaN(day)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}

    if(month < 1 || month > 12){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(day > 31 || day < 1) { throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(month === 4 || month === 6 || month === 9 || month === 11){
        if(day > 30){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    }
    if(month === 2 && day > 28 && !leapYear(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
    if(month === 2 && day > 29 && leapYear(year)){ throw "Release Date should be in the form of YYYY-MM-DD (ex. 2001-01-30)";}
}

function checkKeyword(keyword){ //validation function for keyword from main validatio.js file
    if (!keyword || typeof keyword != 'string' || keyword.trim().length == 0) throw `Please enter your keyword.`;
    keyword = keyword.trim();
    if (keyword != "Title" && keyword != "Director" && keyword != "Actor" && keyword != "Release Date" && keyword != "Reviewer") throw "Keyword is invalid.";
    return keyword;
}

function checkSearchTerm(searchTerm,keyword){
    if(searchTerm){
        if (!/^[a-zA-Z0-9\ \-]+$/g.test(searchTerm)) throw 'Search term contains illegal characters.';
        if(typeof searchTerm != 'string' || searchTerm.trim().length == 0){ throw 'Search term is invalid';} //search term exists make sure it is correct type and not just spaces
        searchTerm = searchTerm.trim();
        if(keyword == "Release Date"){ checkValidDate(searchTerm); } //validate that the user provides a data in the form of 2001-01-30
        return searchTerm;
    } else {
        return searchTerm //empty search term is valid
    }   
}

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
            let reviewDisplayInfo = JSON.parse($('#hiddeninfo').text()); //retrieve data from handlebars render
            //recent
            for(let item of reviewDisplayInfo){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListRecent').append(li);
            }
            //popular
            let reviewDisplayListPopular = reviewDisplayInfo;
            reviewDisplayListPopular.sort((a, b) => { return b.counter - a.counter; });
            for(let item of reviewDisplayListPopular){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListPopular').append(li);
            }
            //alphabetical
            let reviewDisplayListAlphabetical = reviewDisplayInfo;
            reviewDisplayListAlphabetical.sort((a, b) => a.reviewTitle.localeCompare(b.reviewTitle)); //sort reviews alphabetically
            for(let item of reviewDisplayListAlphabetical){ //append all shows to showList ul elemen
                let li = `<a href="/reviews/${item.reviewId}" target="_blank"><button class="list-group-item list-group-item-action" type="button" "><medium>${item.reviewTitle}</medium> <br><small class="font-italic">${item.movieTitle}</small><br> <small>${item.reviewerName}</small> </button></a>`;                    
                $('#reviewListAlphabetical').append(li);
            }
            $('#reviewListRecent').show();
            $(".searchErrorMessage").empty();
            if(reviewDisplayInfo.length == 0){
                $(".searchErrorMessage").html("Sorry there are no results for your search");
            }
            $('#recentlistingoption').trigger('click');
        }
    });

    $("#searchForm").submit(function (event){
        $(".searchErrorMessage").empty();
        let keyword = $("#keyword").val();
        let searchbar = $("#searchbar").val();
        try{
            keyword = checkKeyword(keyword);
            searchbar = checkSearchTerm(searchbar,keyword);
        } catch(e){
            event.preventDefault();
            $(".searchErrorMessage").html(e);
        }
        return;
    });

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