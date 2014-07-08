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
        return localStorage.getItem('keypress') || 'none';
    }

    if (select) {
        select.value = loadOption();
        select.addEventListener('change', function () {
            saveOption(getOption());
        });
    }
})();
