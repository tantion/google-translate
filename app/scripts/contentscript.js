(function () {
    'use strict';

    function isInjectTranslateIframe () {
        var url = location.href;
        if (url.match(/^https?:\/\/translate\.google\./i) && window.top !== window) {
            return true;
        }
        return false;
    }

    function getSelectedText () {
        var txt = window.getSelection().toString() || '';
        txt = txt.trim();
        return txt;
    }

    function triggerSelectedEvent (evt, txt) {
        var e = new MouseEvent('txtextselected', evt);
        e.data = txt;
        window.dispatchEvent(e);
    }

    function detectSelectedText (evt) {
        var txt = getSelectedText();
        if (txt) {
            triggerSelectedEvent(evt, txt);
        }
    }

    function selectedHanlder (evt) {
        document.removeEventListener('mouseup', selectedHanlder, false);
        detectSelectedText(evt);
    }

    // emit txtextselected event
    if (!isInjectTranslateIframe()) {
        document.addEventListener('selectstart', function () {
            document.addEventListener('mouseup', selectedHanlder);
        }, false);
    }

    // selectedText => popup
    chrome.runtime.onMessage.addListener(function (message, sender, resp) {
        if (message.action === 'getSelectedText') {
            resp(getSelectedText());
        }
    });
})();

(function () {
    'use strict';

    // simple promise
    function Promise (func) {
        this._status = '';
        this._doneFun = [];
        this._failFun = [];
        this._data = undefined;
        this._error = undefined;

        var that = this;

        func.call(null, function (data) {
            if (!that.isResolved() && !that.isRejected()) {
                that._status = 'resolved';
                that._data = data;
                that._doneFun.forEach(function (f) {
                    f.call(null, that._data);
                });
            }
        }, function (error) {
            if (!that.isResolved() && !that.isRejected()) {
                that._status = 'rejected';
                that._error = error;
                that._failFun.forEach(function (f) {
                    f.call(null, that._error);
                });
            }
        });
    }

    Promise.prototype = {
        constructor: Promise,

        done: function (f) {
            if (this.isResolved()) {
                f.call(null, this._data);
            } else {
                this._doneFun.push(f);
            }

            return this;
        },

        fail: function (f) {
            if (this.isRejected()) {
                f.call(null, this._error);
            } else {
                this._failFun.push(f);
            }
            return this;
        },

        isResolved: function () {
            return this._status === 'resolved';
        },

        isRejected: function () {
            return this._status === 'rejected';
        }
    };

    function showTranslatePane (time, x, y) {
        var id = 'tx-google-translate-iframe-pane';
        var pane = document.getElementById(id);
        if (!pane) {
            pane = document.createElement('div');
            pane.setAttribute('id', id);
            pane.classList.add('tx-google-translate-pane');

            pane.innerHTML = '<div class="tx-google-translate-pane-title"><span class="tx-google-translate-close"></span></div>' +
                '<div class="tx-google-translate-content">' +
                '<iframe src="https://translate.google.com/" id="tx-google-translate-iframe-elem" class="tx-google-translate-iframe"></iframe></div>';

            document.body.appendChild(pane);
        }

        x -= 20;
        y += 15;

        pane.style.left = x + 'px';
        pane.style.top = y + 'px';

        return new Promise(function (resolve) {
            setTimeout(function () {
                pane.classList.add('tx-google-translate-show');
                resolve();
            }, time);
        });
    }

    function hideTranslatePane () {
        var pane = document.getElementById('tx-google-translate-iframe-pane');
        if (pane) {
            pane.classList.remove('tx-google-translate-show');
        }
    }

    function translate (txt) {
        return new Promise(function (resolve, reject) {
            var iframe = document.getElementById('tx-google-translate-iframe-elem');
            if (iframe) {
                var before = iframe.getAttribute('src');
                var url = 'https://translate.google.com/?q=' + encodeURI(txt);
                console.log(before, url);
                if (before !== url) {
                    iframe.setAttribute('src', url);
                }
                resolve();
            } else {
                reject();
            }
        });
    }

    function handleMouseup () {
        hideTranslatePane();
        document.removeEventListener('mouseup', handleMouseup, false);
    }

    // handle txtextselected event
    window.addEventListener('txtextselected', function (evt) {
        var txt = evt.data;
        var x = evt.pageX;
        var y = evt.pageY;

        showTranslatePane(200, x, y)
        .done(function () {
            document.addEventListener('mouseup', handleMouseup, false);
        });

        translate(txt)
        .fail(function () {
            hideTranslatePane();
        });

    }, false);
})();
