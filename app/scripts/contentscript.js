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

    function getSelectedText () {
        return window.getSelection().toString();
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
    document.addEventListener('selectstart', function () {
        document.addEventListener('mouseup', selectedHanlder);
    }, false);

    // handle txtextselected event
    window.addEventListener('txtextselected', function (evt) {
        console.log(evt);
    }, false);

    // selectedText => popup
    chrome.runtime.onMessage.addListener(function (message, sender, resp) {
        if (message.action === 'getSelectedText') {
            resp(getSelectedText());
        }
    });
})();
