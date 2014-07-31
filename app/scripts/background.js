'use strict';

function loadOption () {
    var key = localStorage.getItem('keypress');
    if (!key) {
        if (navigator.userAgent.indexOf('Macintosh') > -1) {
            key = 'metaKey';
        } else {
            key = 'ctrlKey';
        }
    }
    return key;
}

function openLinkInTab (url) {
    if (url) {
        chrome.tabs.create({url: url});
    }
}

// remove frame-option for translate
chrome.webRequest.onHeadersReceived.addListener(function(info) {
    var headers = info.responseHeaders;
    for (var i=headers.length-1; i>=0; --i) {
        var header = headers[i].name.toLowerCase();
        if (header.match(/(x-)?frame-options/i)) {
            headers.splice(i, 1); // Remove header
        }
    }
    return {responseHeaders: headers};
}, {
    urls: ['*://translate.google.com/*', '*://translate.google.com.hk/*'],
    types: ['sub_frame']
},
['blocking', 'responseHeaders']);

// add Content-Security-Policy frame-src for some domain
chrome.webRequest.onHeadersReceived.addListener(function(info) {
    var headers = info.responseHeaders;
    var directive = 'translate.google.com translate.google.com.hk';

    for (var i=headers.length-1; i>=0; --i) {
        var header = headers[i];
        var name = header.name;
        var value = header.value;
        if (name.match(/Content-Security-Policy/i)) {
            if (value.match(/frame-src ([^;]+)/)) {
                header.value = value.replace(/(frame-src [^;]+)/, '$1 ' + directive);
            } else {
                header.value = value + '; frame-src ' + directive;
            }
        }
    }

    return {responseHeaders: headers};
}, {
    urls: [
        '<all_urls>'
    ],
    types: ['main_frame']
},
['blocking', 'responseHeaders']);

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    var action = message.action;
    var msg = message.message;

    switch (action) {
        case 'keypress':
            response(loadOption());
            break;
        case 'openLink':
            openLinkInTab(msg);
            break;
    }
});
