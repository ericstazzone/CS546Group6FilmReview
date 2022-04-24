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
});