// !!! OBSOLETE !!! Will probably delete soon

// function fadeList(list, duration=250, index=0) {
//     if (index < $(list).children().length) {
//         $($(list).find('li').eq(index)).animate({
//             opacity: 1,
//             left: "+=50px"
//         }, duration, 'easeOutQuad');
//         setTimeout(function() {
//             fadeList(list, duration, index + 1)
//         }, duration/2);
//     }
// }

// function fadeContainers(containers, duration=1000, index=0) {
//     // This method uses simultaneous animation for the categories
//     for (const container of $(containers).children()) {
//         const list = $(container).find('ul').eq(0);
//         $(container).animate({
//             opacity: 1,
//             bottom: '+=250px',
//         }, duration, 'easeOutQuint');
//         setTimeout(function() {
//             fadeList($(list));
//         }, duration/4);
//     }

//     // This method uses sequential animation for the categories
//     /*
//     if (index < $(containers).children().length) {
//         const container = $(containers).find('section').eq(index);
//         const list = $(container).find('ul').eq(0);
//         $(container).animate({
//             opacity: 1,
//             bottom: '+=250px',
//         }, duration, 'easeOutQuint');
//         setTimeout(function() {
//             fadeList($(list));
//         }, duration/4);
//         setTimeout(function() {
//             fadeContainers(containers, duration, index + 1);
//         }, duration/10);
//     }
//     */
// }

// $(document).ready(function() {
//     fadeContainers($('#categories'));
// });