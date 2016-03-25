/**
 * Created by nbugash on 3/8/16.
 */
if (appspider === undefined) {
    var appspider = {};
}
appspider.util = {
    parseAttackRequest: function (request, unparsedheaderString) {
        /* Start */
        var headerArray = unparsedheaderString.split('\r\n');
        var headers = [];
        for (var i = 0; i < headerArray.length; i++) {
            if (headerArray[i].toUpperCase().match(/(^GET|^POST|^PUT|^DELETE)/)) {
                var requestArray = headerArray[i].split(' ');
                request.method = requestArray[0];
                request.uri = appspider.util.parseUri(appspider.schema.uri(), requestArray[1]);
                request.version = requestArray[2];
            } else if (headerArray[i].indexOf(':') > -1) {
                var a = headerArray[i].split(':');
                var header_name = a[0].trim();
                switch (header_name.toLowerCase()) {
                    case 'referer':
                        headers.push({
                            key: 'Referer',
                            value: a.slice(1).join(':').trim()
                        });
                        break;
                    case 'cookie':
                        var cookiearray = a[a.length - 1].split(';');
                        var cookies = [];
                        for (var x = 0; x < cookiearray.length; x++) {
                            if (cookiearray[x].indexOf('=') > -1) {
                                var array = cookiearray[x].split('=');
                                var key = array[0].trim();
                                var value = array[array.length - 1].trim();
                                cookies.push({
                                    key: key,
                                    value: value
                                });
                            }
                        }
                        request.cookie = cookies;
                        break;
                    case 'host':
                        request.uri.url = a[a.length - 1].trim();
                        headers.push({
                            key: 'Host',
                            value: a[a.length - 1].trim()
                        });
                        break;
                    default:
                        headers.push({
                            key: header_name,
                            value: a[a.length - 1].trim()
                        });
                        break;
                }
            }
        }
        request.headers = headers;
        /* End */
        return request;
    },
    parseAttackResponse: function (headerString) {
        var headerArray = headerString.split('\r\n');
        var headers = [];
        for (var i = 0; i < headerArray.length; i++) {
            if (headerArray[i].toUpperCase().match(/(^GET|^POST|^PUT|^DELETE)/)) {
                var requestArray = headerArray[i].split(' ');
                headers.push({
                    key: 'REQUEST',
                    value: {
                        method: requestArray[0],
                        uri: requestArray[1],
                        version: requestArray[2]
                    }
                });
            } else if (headerArray[i].indexOf(':') > -1) {
                var a = headerArray[i].split(':');
                var header_name = a[0].trim();
                switch (header_name) {
                    case 'Referer':
                        headers.push({
                            key: 'Referer',
                            value: a.slice(1).join(':').trim()
                        });
                        break;
                    case 'Cookie':
                        var cookiearray = a[a.length - 1].split(';');
                        var cookies = [];
                        for (var x = 0; x < cookiearray.length; x++) {
                            if (cookiearray[x].indexOf('=') > -1) {
                                var array = cookiearray[x].split('=');
                                var key = array[0].trim();
                                var value = array[array.length - 1].trim();
                                cookies.push({
                                    key: key,
                                    value: value
                                });
                            }
                        }
                        headers.push({
                            key: 'Cookie',
                            value: cookies
                        });
                        break;
                    default:
                        headers.push({
                            key: header_name,
                            value: a[a.length - 1].trim()
                        });
                        break;
                }
            }
        }
        return headers;
    },
    stringifyAttackResponse: function (headers) {
        var attackResponseString = '';
        for (var index in headers) {
            if (headers.hasOwnProperty(index)) {
                attackResponseString += headers[index].key + ': ' + headers[index].value + '\r\n'
            }
        }
        return attackResponseString;
    },
    stringifyAttackRequest: function (request) {
        var attackRequestString = '';
        attackRequestString += request.method + ' ' + request.uri.path + request.uri.queryString +
            ' ' + request.version + '\r\n';
        for (var index in request.headers) {
            if (request.headers.hasOwnProperty(index)) {
                attackRequestString += request.headers[index].key + ": " + request.headers[index].value + "\r\n"
            }
        }

        attackRequestString += "Cookies: { \r\n\t";
        for (var c in request.cookie) {
            if (request.cookie.hasOwnProperty(c)) {
                attackRequestString += request.cookie[c].key + ":" + request.cookie[c].value + ', \r\n\t';
            }
        }
        attackRequestString += "}\r\n";

        return attackRequestString;
    },
    stringifyCookies: function (cookies) {
        var cookiestr = '';
        for (var index in cookies) {
            if (cookies.hasOwnProperty(index)) {
                cookiestr += cookies[index].key + '=' + cookies[index].value + ';';
            }
        }
        return cookiestr;
    },
    parseUri: function (uriSchema, unparsedUri) {
        if (unparsedUri.indexOf('?') > 0) {
            uriSchema.path = unparsedUri.substring(0, unparsedUri.indexOf('?'));
            // ignore the '?'
            var queryString = unparsedUri.substring(unparsedUri.indexOf('?') + 1);
            var queryArray = queryString.split('&');
            for (var index in queryArray) {
                if (queryArray.hasOwnProperty(index)) {
                    uriSchema.parameters.push({
                        key: queryArray[index].split('=')[0],
                        value: queryArray[index].split('=')[1]
                    });
                }
            }
            uriSchema.queryString = unparsedUri.substring(unparsedUri.indexOf('?'));
        } else {
            uriSchema.parameters = [];
            uriSchema.path = unparsedUri;
        }
        return uriSchema;
    },
    queryString: function (parameters) {
        var str = "";
        if (_.size(parameters) === 0) {
            return str;
        } else {
            str += "?";
            for (var index in parameters) {
                str += parameters[index].key + '=' + parameters[index].value + "&";
            }
            return str.substring(0, str.length - 1);
        }
    }
};