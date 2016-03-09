/**
 * Created by nbugash on 07/03/16.
 */
$(function(){
    /* Enable Bootstrap dropdown */
    $('.dropdown-toggle').dropdown();

    /* Enable collapsing of side navigation bar */
    $('#appspider-logo').click(function (e) {
        e.preventDefault();
        $('.main').toggleClass('toggled');
    });
});