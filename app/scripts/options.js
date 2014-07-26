(function () {
    'use strict';

    var select = document.getElementById('tx-keypress');

    function getOption () {
        var option = select.options[select.selectedIndex];
        if (option) {
            return option.value;
        }
    }

    function saveOption (value) {
        localStorage.setItem('keypress', value);
    }

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

    if (select) {
        select.value = loadOption();
        select.addEventListener('change', function () {
            saveOption(getOption());
        });
    }

    var link = document.querySelector('#open-tab-link');
    if (link) {
        link.addEventListener('click', function (evt) {
            evt.preventDefault();
            chrome.runtime.sendMessage({
                action: 'openLink',
                message: this.href
            });
        }, false);
    }
})();
