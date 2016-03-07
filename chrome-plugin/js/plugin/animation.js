/**
 * Created by nbugash on 07/03/16.
 */
$("a > img#appspider-logo").click(function(e) {
    e.preventDefault();
    $(".main").toggleClass("toggled");
});