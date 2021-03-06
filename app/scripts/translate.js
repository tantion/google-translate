(function () {
    'use strict';

    function isInjectTranslateIframe () {
        var url = location.href;
        if (url.match(/^https?:\/\/translate\.google\./i) && window.top !== window) {
            return true;
        }
        return false;
    }

    function findElems (slectors) {
        var elems = [];
        var slice = Array.prototype.slice;

        slectors.forEach(function (s) {
            var els = document.querySelectorAll(s);
            els = slice.call(els, 0);
            elems = elems.concat(els);
        });

        return elems;
    }

    (function () {
        if (!isInjectTranslateIframe()) {
            return;
        }

        var elems = findElems(['#gt-ft-res']);

        elems.forEach(function (elem) {
            elem.classList.add('tx-google-translate-hide');
        });

        // hide some block
        var tx = document.getElementById('gt-appname');
        if (tx) {
            tx.setAttribute('title', chrome.i18n.getMessage('newTab'));
            tx.setAttribute('target', '_blank');
            tx.addEventListener('mousedown', function () {
                this.setAttribute('href', location.href);
            });
        }

        //
        // Fixed auto translate
        //
        window.addEventListener('load', function () {
            var elem = document.getElementById('gt-submit');
            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            elem.dispatchEvent(evt);
        });
    })();
})();
