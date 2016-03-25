/**
 * Created by nbugash on 3/8/16.
 */

if (appspider === undefined) {
    var appspider = {};
}
appspider.http = {
    /* Allow restricted header in being altered */
    modifyHeaders: function (attack_headers) {
        var headers = {};
        switch (typeof attack_headers) {
            case 'object':
                for (var index in attack_headers) {
                    if (attack_headers.hasOwnProperty(index)) {
                        var header = attack_headers[index].key;
                        if (_.contains(appspider.chrome.global.RESTRICTED_CHROME_HEADERS, header.toUpperCase())) {
                            headers[appspider.chrome.global.TOKEN + header] = attack_headers[index].value;
                        } else {
                            headers[header] = attack_headers[index].value;
                        }
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
        viaXHR: function (attack, success, error) {
            console.log('Sending attack id: ' + attack.id + ' via XMLHTTPRequest');

            var xhr = new XMLHttpRequest();
            xhr.open(
                attack.request.method,
                attack.request.uri.protocol + '://' + attack.request.uri.url + attack.request.uri.path + attack.request.uri.queryString,
                true
            );
            console.log('Customizing http request headers for attack id: ' + attack.id);
            var headers = appspider.http.modifyHeaders(attack.request.headers);
            headers[appspider.chrome.global.TOKEN + 'cookie'] = appspider.util.stringifyCookies(attack.request.cookie);
            /* Request headers */
            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    xhr.setRequestHeader(h, headers[h]);
                }
            }
            console.log('Done setting custom headers!.');

            xhr.onreadystatechange = function () {
                if (xhr.status === 200) {
                    switch (xhr.readyState) {
                        case 0:
                            console.log('Request not yet initialized');
                            break;
                        case 1:
                            console.log('Server connection established.');
                            break;
                        case 2:
                            console.log('Request received');
                            break;
                        case 3:
                            console.log('Processing request');
                            break;
                        case 4:
                            console.log('Request finished and response is ready');
                            console.log('Receiving http response for attack id: ' + attack.id +
                                ' with readyState: ' + xhr.readyState + ' and status of ' + xhr.status);
                            success(xhr);
                            break;
                        default:
                            error(xhr);
                            console.error('Background.js: xhr.status: ' + xhr.status +
                                ' xhr.readyState: ' + xhr.readyState +
                                ' for attack id: ' + attack.id);
                            break;

                    }
                } else {
                    console.log('Background.js - ' + xhr.status + ': Page not found');
                }
            };

            switch (attack.request.method.toUpperCase()) {
                case 'GET':
                    console.log('Sending request using GET XMLHTTPRequest');
                    xhr.send();
                    break;
                case 'POST':
                    console.log('Sending request using POST XMLHTTPRequest');
                    xhr.send(attack.request.payload);
                    break;
                default:
                    console.error('Background.js: Unable to send request');
                    break;
            }
        }
    },
    decodeRequest: function (encodedRequest) {
        return window.atob(encodedRequest);
    },
    /* Split the decoded request to multiple requests*/
    splitRequests: function (decodedRequests) {
        var requests = decodedRequests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].match(/(#H#G#F#E#D#C#B#A#)/)) {
                delete requests[i];
            }
        }
        return requests;
    },
    /* Split the request to header, payload, description,
     response header, and response content */
    splitRequest: function (request) {
        if (_.size(request) !== 0) {
            var array = request.split(/(A#B#C#D#E#F#G#H#)/);
            var header_payload = array[0];
            return {
                unParsedHeaders: header_payload.split('\r\n\r\n')[0].trim(),
                payload: header_payload.split('\r\n\r\n')[1].trim(),
                description: array[2].trim()
            };
        }


    }

};