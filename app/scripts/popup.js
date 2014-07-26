// lazy load iframe
(function () {
    'use strict';

    var elem = document.querySelector('.tx-google-translate-lazy-load');
    var pane = document.querySelector('.tx-google-translate-pane');

    function translate (txt) {
        if (pane) {
            pane.classList.remove('loaded');
            pane.classList.remove('error');
        }

        if (elem) {
            var src = elem.dataset.src;
            var before = elem.getAttribute('src');

            if (before === 'about:blank') {
                elem.onload = function () {
                    console.log(elem);
                    if (pane) {
                        pane.classList.add('loaded');
                    }
                };
                elem.onerror = function () {
                    if (pane) {
                        pane.classList.add('error');
                    }
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
