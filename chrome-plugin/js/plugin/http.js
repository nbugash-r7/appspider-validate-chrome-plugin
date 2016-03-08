/**
 * Created by nbugash on 3/8/16.
 */

if (appspider === undefined) {
    var appspider = {}
}
;
appspider.http = {
    /* Allow restricted header in being altered */
    modifyHeaders: function (attack_headers) {
        var headers = {};
        switch (typeof attack_headers) {
            case 'object':
                for (var header in attack_headers) {
                    if (attack_headers.hasOwnProperty(header)) {
                        if (_.contains(appspider.global.RESTRICTED_CHROME_HEADERS, header.toLocaleUpperCase())) {
                            switch (header) {
                                case 'Cookie':
                                    var cookie_str = '';
                                    for (var key in attack_headers.Cookie) {
                                        if (attack_headers.Cookie.hasOwnProperty(key)) {
                                            cookie_str += key + '=' + attack_headers.Cookie[key] + '; ';
                                        }
                                    }
                                    headers[appspider.global.TOKEN + header] = cookie_str;
                                    break;
                                case 'REQUEST':
                                    break; //skip
                                default:
                                    headers[appspider.global.TOKEN + header] = attack_headers[header];
                                    break;
                            }
                        }
                    } else {
                        headers[header] = attack_headers[header];
                    }
                }
                break;
            default:
                console.error('Appspider.js: Cannot parse the headers!!');
                return false;
        }
        return headers;
    },
    send: {
        viaXHR: function (id) {
            console.log('Sending attack id: ' + id + ' via XMLHTTPRequest');
            appspider.storage.local.retrieve(id, function (attack) {
                var xhr = new XMLHttpRequest();
                xhr.open(
                    attack.headers.REQUEST.method,
                    'http://' + attack.headers.Host + attack.headers.REQUEST.uri,
                    true
                );
                console.log('Customizing http request headers for attack id: ' + attack_id);
                var headers = appspider.http.modifyHeaders(attack.headers);
                for (var h in headers) {
                    if (headers.hasOwnProperty(h)) {
                        xhr.setRequestHeader(h, headers[h]);
                    }
                }
                console.log('Done setting custom headers!.');
            });
        }
    }
};