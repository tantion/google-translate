'use strict';

// remove frame-option for translate
chrome.webRequest.onHeadersReceived.addListener(function(info) {
    var headers = info.responseHeaders;
    for (var i=headers.length-1; i>=0; --i) {
        var header = headers[i].name.toLowerCase();
        if (header.match(/(x-)?frame-options/i)) {
            headers.splice(i, 1); // Remove header
        }
    }
    console.log(info);
    return {responseHeaders: headers};
}, {
    urls: ['*://translate.google.com/*', '*://translate.google.com.hk/*'],
    types: ['sub_frame']
},
['blocking', 'responseHeaders']);