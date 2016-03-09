/**
 * Created by nbugash on 3/8/16.
 */
if (appspider === undefined) {
    var appspider = {};
}
appspider.helper = {
    convertHeaderStringToJSON: function (headerString) {
        var headerArray = headerString.split('\r\n');
        var headers = {};
        for (var i = 0; i < headerArray.length; i++) {
            if (headerArray[i].toUpperCase().match(/(^GET|^POST|^PUT|^DELETE)/)) {
                var requestArray = headerArray[i].split(' ');
                headers.REQUEST = {
                    method: requestArray[0],
                    uri: requestArray[1],
                    version: requestArray[2]
                };
            } else if (headerArray[i].indexOf(':') > -1) {
                var a = headerArray[i].split(':');
                var header_name = a[0].trim();
                switch (header_name) {
                    case 'Referer':
                        headers.Referer = a.slice(1).join(':').trim();
                        break;
                    case 'Cookie':
                        var cookiearray = a[a.length - 1].split(';');
                        var cookieValues = {};
                        for (var x = 0; x < cookiearray.length; x++) {
                            if (cookiearray[x].indexOf('=') > -1) {
                                var array = cookiearray[x].split('=');
                                cookieValues[array[0].trim()] = array[array.length - 1].trim();
                            }
                        }
                        headers.Cookie = cookieValues;
                        break;
                    default:
                        headers[header_name] = a[a.length - 1].trim();
                        break;
                }
            }
        }
        return headers;
    }
};