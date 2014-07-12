// lazy load iframe
(function () {
    'use strict';

    var elem = document.querySelector('.tx-google-translate-lazy-load');

    function translate (txt) {
        if (elem) {
            var src = elem.dataset.src;
            var before = elem.getAttribute('src');

            if (before === 'about:blank') {
                elem.onload = function () {
                    this.classList.remove('tx-google-translate-error');
                    this.classList.add('tx-google-translate-loaded');
                };
                elem.onerror = function () {
                    this.classList.remove('tx-google-translate-loaded');
                    this.classList.add('tx-google-translate-error');
                };
            }

            if (!txt) {
                txt = localStorage.getItem('translate');
            } else {
                localStorage.setItem('translate', txt);
            }

            if (txt) {
                src += '?q=' + encodeURI(txt);
            }

            if (src !== before) {
                elem.setAttribute('src', src);
            }
        }
    }

    translate();

    chrome.tabs.query({active: true}, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, {action: 'getSelectedText'}, function (response) {
            translate(response);
        });
    });
})();
