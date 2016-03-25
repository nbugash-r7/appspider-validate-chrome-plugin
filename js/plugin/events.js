/**
 * Created by nbugash on 3/10/16.
 */
/* CHROME API */
chrome.storage.onChanged.addListener(function (attacks, namespace) {
    for (var id in attacks) {
        var attack = attacks[id];
        $('textarea#appspider-request-header-' + id).val(appspider.util.stringifyAttackRequest(
            attack.newValue.request));
        $('textarea#appspider-payload-' + id).val(attack.newValue.request.payload);
        $('textarea#appspider-response-header-' + id).val(appspider.util.stringifyAttackResponse(
            attack.newValue.response.headers));
        $('textarea#appspider-response-content-' + id).val(attack.newValue.response.content);
    }
});