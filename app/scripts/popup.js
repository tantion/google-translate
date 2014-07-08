// lazy load iframe
(function () {
    'use strict';

    var elems = document.querySelectorAll('.tx-google-translate-lazy-load');

    elems = Array.prototype.slice.call(elems, 0);

    elems.forEach(function (elem) {
        var src = elem.dataset.src;
        var blank = elem.getAttribute('src');
        if (blank !== src) {
            elem.setAttribute('src', src);
        }

        elem.onload = function () {
            this.classList.add('loaded');
        };
    });

})();
