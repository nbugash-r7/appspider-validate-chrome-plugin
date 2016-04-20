/**
 * Created by nbugash on 07/03/16.
 */
$(function(){
    $('#cookieModal').modal({
        keyboard: true,
        show: true
    });

    /* Enable collapsing of side navigation bar */
    $('#appspider-logo').click(function (e) {
        e.preventDefault();
        $('.main').toggleClass('toggled');
    });

    /* Prevent dropdown-menu from closing */
    $('ul.noclose').click(function(e) {
        e.stopPropagation();
    });
});