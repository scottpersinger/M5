// Setup TWITTER global object and a bunch of util functions
(function (a, g) {
    var e, d, c, b, f, h, j, i = Object.prototype.toString,
        k = navigator.userAgent,
        n = document;
    e = function () {
        function b(a, c, f) {
            var j = d[c];
            j ? a[j.fullName || j.name] = j : (j = h[c]) ? g.augment(a, j) : f && (e[c] = e[c] || [], e[c].push(f));
            return a
        }
        var c = {},
            d = {},
            h = {},
            e = {};
        return {
            use: function (c, f) {
                if (g.isFunction(f)) if (g.isArray(c)) {
                    var d = new a;
                    g.each(c, function (a) {
                        b(d, a)
                    });
                    f(d)
                } else f(b(new a, c))
            },
            add: function (f, d, h) {
                var e = new a;
                h && h.requires && g.each(h.requires, function (a) {
                    b(e, a, f)
                });
                c[f] = {
                    cb: d,
                    T: e
                };
                g.isFunction(d) && d(e)
            },
            register: function (b, j, i, k) {
                if (g.isFunction(j)) {
                    var l = i || j.name;
                    d[b] = j;
                    j.fullName = l;
                    e[b] && (g.each(e[b], function (a) {
                        c[a].T[l] = j
                    }), delete e[b])
                } else g.isObject(j) && (k && k.bundle ? f.augment(a.prototype, j) : (h[b] = j, e[b] && (g.each(e[b], function (a) {
                    g.augment(c[a].T, j)
                }), delete e[b])))
            }
        }
    }();
    window.ENV = {
        DEBUG: !1
    };
    window.TWITTER = e;
    g = new a;
    d = function () {
        var a, b = {
            undefined: "undefined",
            number: "number",
            "boolean": "boolean",
            string: "string",
            "[object Function]": "function",
            "[object RegExp]": "regexp",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object Error]": "error"
        },
            c = /^\s+|\s+$/g;
        a = {};
        a.isArray = function (b) {
            return a.type(b) === "array"
        };
        a.isBoolean = function (a) {
            return typeof a === "boolean"
        };
        a.isFunction = function (b) {
            return a.type(b) === "function"
        };
        a.isDate = function (b) {
            return a.type(b) === "date"
        };
        a.isNull = function (a) {
            return a === null
        };
        a.isNumber = function (a) {
            return typeof a === "number" && isFinite(a)
        };
        a.isObject = function (b, c) {
            return b && (typeof b === "object" || !c && a.isFunction(b)) || !1
        };
        a.isString = function (a) {
            return typeof a === "string"
        };
        a.isUndefined = function (a) {
            return typeof a === "undefined"
        };
        a.trim = function (a) {
            try {
                return a.replace(c, "")
            } catch (b) {
                return a
            }
        };
        a.isValue = function (b) {
            var c = a.type(b);
            switch (c) {
            case "number":
                return isFinite(b);
            case "null":
            case "undefined":
                return !1;
            default:
                return !!c
            }
        };
        a.areEquals = function (b, c) {
            if (b === null || c === null || typeof b === "undefined" || typeof c === "undefined") return b === c;
            for (var f in b) if (typeof b[f] !== typeof c[f]) return !1;
            else {
                if (b[f] === null !== (c[f] === null)) return !1;
                switch (typeof b[f]) {
                case "undefined":
                    if (typeof c[f] != "undefined") return !1;
                    break;
                case "object":
                    if (b[f] !== null && c[f] !== null && (b[f].constructor[i]() !== c[f].constructor[i]() || !a.areEquals(b[f], c[f]))) return !1;
                    break;
                case "function":
                    if (f != "equals" && b[f][i]() != c[f][i]()) return !1;
                    break;
                default:
                    if (b[f] !== c[f]) return !1
                }
            }
            return !0
        };
        a.type = function (a) {
            return b[typeof a] || b[i.call(a)] || (a ? "object" : "null")
        };
        return a
    }();
    c = {
        _logLevel: 0,
        log: function (a) {
            n.defaultView.console && console.log(a)
        },
        trace: function () {
            c._logLevel >= 3 && c.log.apply(c, arguments)
        },
        debug: function () {
            c._logLevel >= 2 && c.log.apply(c, arguments)
        },
        warn: function () {
            c._logLevel >= 1 && c.log.apply(c, arguments)
        },
        error: function (a, b) {
            c._logLevel >= 0 && c.log.apply(c, arguments);
            if (b) throw Error(a);
        },
        setLogLevel: function (a) {
            var b = 0;
            switch (a) {
            case "trace":
                b = 3;
                break;
            case "debug":
                b = 2;
                break;
            case "warn":
                b = 1;
                break;
            case "error":
                b = 0;
                break;
            default:
                b = 0
            }
            c._logLevel = b
        },
        each: function (a, b, c) {
            if (!a || !a.length) return !1;
            if (g.isFunction(a.forEach)) a.forEach(b, c);
            else for (var f = 0, d = a.length; f < d; f++) b.call(c || a[f], a[f], f)
        },
        iterate: function (a, b, c) {
            c = c || a;
            for (var f in a) a.hasOwnProperty(f) && b.call(c, a[f], f)
        }
    };
    b = {
        getElementNode: function (a) {
            for (; a && a.nodeType != 1;) a = a.parentNode;
            return a
        },
        get: function (a, c) {
            if (!d.isString(a)) return a;
            var f = b.getAll(a, c);
            return !f.length ? null : f[0]
        },
        getAll: function (a, b) {
            if (!d.isString(a)) return [a];
            b = b || n;
            return Array.prototype.slice.call(b.querySelectorAll(a))
        },
        createElement: function (a, b) {
            var c = n.createElement(a),
                f;
            for (f in b) if (b.hasOwnProperty(f) && b[f] !== null) switch (f) {
            case "className":
            case "innerHTML":
                c[f] = b[f];
                break;
            default:
                c.setAttribute(f, b[f])
            }
            return c
        },
        removeElement: function (a) {
            (a = b.get(a)) && a.parentNode && a.parentNode.removeChild(a);
            return a
        },
        insertBefore: function (a, c) {
            c = b.get(c);
            c.parentNode.insertBefore(a, c)
        },
        insertAfter: function (a, c) {
            c = b.get(c);
            c.parentNode.insertBefore(a, c.nextSibling)
        },
        getStyle: function (a, c) {
            a = b.get(a);
            if (!a) return !1;
            return window.getComputedStyle ? n.defaultView.getComputedStyle(a, null).getPropertyValue(c) : a.currentStyle ? a.currentStyle[c] : a.style[c]
        },
        setStyle: function (a, c, f) {
            (a = b.get(a)) && a.style && (f === null ? a.style.removeProperty(c) : a.style[c] = f)
        },
        setStyles: function (a, c) {
            (a = b.get(a)) && a.style && this.iterate(c, function (b, c) {
                this.setStyle(a, c, b)
            }, this)
        },
        getXY: function (a, c) {
            a = b.get(a);
            var f = [a.offsetLeft, a.offsetTop],
                d = a.offsetParent,
                h = this.getStyle(a, "position") === "absolute" && a.offsetParent == a.ownerDocument.body;
            if (d != a) for (; d && d != c;) f[0] += d.offsetLeft, f[1] += d.offsetTop, !h && d.style.position == "absolute" && (h = !0), d = c == d.parentNode ? null : d.offsetParent;
            h && (f[0] -= a.ownerDocument.body.offsetLeft, f[1] -= a.ownerDocument.body.offsetTop);
            return f
        },
        addClass: function (a, c) {
            (a = b.get(a)) && !this.hasClass(a, c) && (a.className += " " + c);
            return a
        },
        removeClass: function (a, c) {
            (a = b.get(a)) && (a.className = a.className.replace(RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)", "g"), " ").replace(/^\s+|\s+$/g, ""));
            return a
        },
        hasClass: function (a, c) {
            var f = !1;
            (a = b.get(a)) && a.className && a.className.match && (f = a.className.match(RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)")) !== null);
            return f
        },
        inheritsClass: function (a, c, f) {
            return b.hasClass(a, c) || !! b.getAncestorByClassName(a, c, f)
        },
        contains: function (a, b) {
            function c(a, b, d) {
                if (d === n || d === n.body) return !0;
                else if (b === n.body) return !1;
                else if (b === a) return !0;
                else if (b && b.parentNode) return f++, c(a, b.parentNode, d || a)
            }
            var f = 1;
            return c(a, b) ? f : !1
        },
        getAncestorBy: function (a, c, f, d) {
            a = b.get(a);
            f = f || c;
            if (c.call(f, a)) return a;
            else if (!(a === n.body || a === d) && a) return this.getAncestorBy(a.parentNode, c, f);
            return !1
        },
        getAncestorByClassName: function (a, b, c) {
            return this.getAncestorBy(a, function (a) {
                return g.hasClass(a, b)
            }, null, c)
        },
        getAncestorByTagName: function (a, b, c) {
            return this.getAncestorBy(a, function (a) {
                return a.nodeName.toLowerCase() === b
            }, null, c)
        }
    };
    f = {
        provide: function (a) {
            var b, c = a.split("."),
                f = window;
            a = 0;
            for (b = c.length; a < b; a++) f[c[a]] = d.isUndefined(f[c[a]]) ? {} : f[c[a]], f = f[c[a]]
        },
        extend: function (a, b, c, f) {
            a.prototype.__proto__ = b.prototype;
            a.prototype.constructor = a;
            if (b.prototype.constructor == Object.prototype.constructor) b.prototype.constructor = b;
            a.superclass = b.prototype;
            c && g.iterate(c, function (b, c) {
                a.prototype[c] = b
            });
            f && g.iterate(f, function (b, c) {
                a[c] = b
            });
            return a
        },
        clone: function () {
            var a = {};
            g.each(arguments, function (b) {
                g.augment(a, b)
            });
            return a
        },
        mix: function (a, b, c) {
            a = g.augment.call(this, a, b, c);
            return a = g.augmentProto.call(this, a, b, c)
        },
        augment: function (a, b, c) {
            for (var f in b) if (b.hasOwnProperty(f) && (c && !d.isUndefined(a[f]) || d.isUndefined(a[f]))) a[f] = b[f];
            return a
        },
        augmentProto: function (a, b, c) {
            for (var f in b.prototype) if (c && typeof!d.isUndefined(a.prototype[f]) || d.isUndefined(a.prototype[f])) a.prototype[f] = b.prototype[f];
            return a
        },
        bind: function (a, b) {
            var c = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
            return function () {
                var f = arguments.length ? Array.prototype.slice.call(arguments) : [];
                g.each(c, function (a) {
                    f.push(a)
                });
                return a.apply(b || a, f)
            }
        }
    };
    h = {
        Browser: function () {
            var a = {
                HardwareAccel: !1,
                Apple: !1,
                Safari: !1,
                webOS: !1,
                Android: !1,
                WebKit: !1,
                Chrome: !1,
                iPad: !1,
                PlayBook: !1,
                version: 0
            },
                c;
            if (!d.isUndefined(navigator)) {
                if (/ AppleWebKit\//.test(k)) a.WebKit = !0;
                if (/Android/.test(k)) a.Android = !0;
                if (/Chrome/.test(k)) a.Chrome = !0;
                if (/RIM Tablet OS/.test(k)) a.PlayBook = !0;
                if (/i(Phone|P(o|a)d)/.test(k)) a.Apple = !0;
                if (a.Apple && /iPad/.test(k)) a.iPad = !0;
                if (a.Apple || !a.PlayBook && !a.Android && !a.webOS && /Safari/.test(k)) a.Safari = !0;
                if (a.iPad || a.Chrome || a.PlayBook) a.tablet = !0;
                if ((c = window.location.search.match(/html5=(\w+)/)) && c.length == 2) if (c = c[1].toLowerCase(), c == "android_tablet") a.Apple = !1, a.iPad = !1, a.Android = !0, a.Chrome = !1, a.tablet = !0;
                if (a.Apple) if ((c = k.match(/iPhone OS (\d)/)) && c.length == 2) a.version = parseInt(c[1], 10);
                else {
                    if ((c = k.match(/OS (\d)/)) && c.length == 2) a.version = parseInt(c[1], 10)
                } else if (a.Android && (c = k.match(/Android (\d)\.(\d)/)) && c.length == 3) a.version = parseFloat(c[1] + "." + c[2], 10);
                if (a.Safari || a.tablet) if (a.HardwareAccel = !0, a.Apple && a.version < 4) a.HardwareAccel = !1
            }
            a.Android && b.addClass(n.documentElement, "android");
            a.Apple && !a.iPad && b.addClass(n.documentElement, "iphone");
            a.iPad && b.addClass(n.documentElement, "ipad");
            a.PlayBook && b.addClass(n.documentElement, "playbook");
            a.tablet && b.addClass(n.documentElement, "tablet");
            return a
        }()
    };
    j = function () {
        var a = function () {
                var a, b = 0;
                return {
                    setPosition: function (c) {
                        a = c;
                        b = (new Date).getTime()
                    },
                    getPosition: function () {
                        return (new Date).getTime() - 12E4 > b ? null : a
                    }
                }
            }();
        return {
            getCurrentPosition: function (b) {
                function c(f) {
                    g.trace("Geo: position adquired");
                    a.setPosition(f);
                    g.success(b, f)
                }
                function f(c) {
                    g.trace("Geo Error: " + c);
                    a.setPosition(null);
                    g.failure(b, c)
                }
                b = b || {};
                var d = a.getPosition();
                d ? (g.trace("Geo: using cached position"), c(d)) : navigator.geolocation ? navigator.geolocation.getCurrentPosition(c, f) : f("not supported")
            }
        }
    }();
    if (!Array.prototype.filter) Array.prototype.filter = function (a, b) {
        if (!a) return this;
        var c, f, d = this.length,
            h = [];
        for (c = 0; c < d; c++) c in this && (f = this[c], a.call(b, f, c, this) && h.push(f));
        return h
    };
    String.prototype.escapeHTML = function () {
        return this.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")
    };
    String.prototype.safeEncode = function () {
        return /%[a-f|A-F|0-9]{2}/.test(this) ? this.toString() : encodeURIComponent(this.toString())
    };
    f.augment(a.prototype, e);
    f.augment(a.prototype, d);
    f.augment(a.prototype, c);
    f.augment(a.prototype, b);
    f.augment(a.prototype, {
        getCurrentTransform: function (a) {
            a = g.get(a);
            a = g.getStyle(a, "-webkit-transform").replace(")", "").split(",");
            if (a.length === 6) return [Number(a[4]), Number(a[5])];
            return [0, 0]
        },
        animate: function (a, b) {
            a = typeof a === "string" ? g.get(a) : a;
            var c, f = {},
                d = b.easing || "cubic-bezier(0.25, 0.1, 0.25, 1)",
                h = b.duration || "350ms",
                e = [],
                j = [],
                i, k, n;
            g.iterate(b.properties, function (a, c) {
                switch (c) {
                case "left":
                case "right":
                    d = b.easing || "ease-in-out";
                    c = "-webkit-transform";
                    j.push("translateX(" + a + ")");
                    break;
                case "top":
                case "bottom":
                    d = b.easing || "ease-in-out";
                    c = "-webkit-transform";
                    j.push("translateY(" + a + ")");
                    break;
                default:
                    f[c] = a
                }
                e.push(c)
            });
            c = g.getStyle(a, "position");
            (c != "absolute" || c != "relative") && g.setStyle(a, "position", "relative");
            j.length > 0 && (f["-webkit-transform"] ? f["-webkit-transform"] += " " + j.join(" ") : f["-webkit-transform"] = j.join(" "));
            g.setStyle(a, "-webkit-transition", [e.join(" "), h, d].join(" "));
            g.iterate(f, function (b, c) {
                a.style[c] = b
            });
            n = function () {
                a.removeEventListener("webkitTransitionEnd", n, !1);
                i && (clearTimeout(i), i = null, g.setStyle(a, "-webkit-transition", null), b.callback && (k = b.callback.scope || b.callback.onComplete, b.callback.onComplete.call(k)))
            };
            a.addEventListener("webkitTransitionEnd", n, !1);
            i = setTimeout(n, parseInt(h, 10) + 200)
        }
    });
    f.augment(a.prototype, {
        callback: function (a, b) {
            var c, f = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
            a = a || {};
            c = a.scope || window;
            g.isFunction(a[b]) && a[b].apply(c, f)
        },
        success: function (a) {
            var b, c = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
            a = a || {};
            b = a.scope || window;
            g.isFunction(a.success) && a.success.apply(b, c)
        },
        failure: function (a) {
            var b, c = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
            a = a || {};
            b = a.scope || window;
            g.isFunction(a.failure) && a.failure.apply(b, c)
        },
        io: function (a, b) {
            var c, f = new XMLHttpRequest,
                d = b.method || "get",
                h = b.callback ? b.callback.success : null,
                e = b.callback ? b.callback.failure : null,
                j = b.callback ? b.callback.scope : null,
                i = b.params || null,
                k = b.headers || {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json"
                },
                s = null,
                B = !0,
                A = n.body,
                y, w, x;
            if (b.dataType === "jsonp") {
                if ("onLine" in navigator && !navigator.onLine) return e && e(), !1;
                w = "jsonp" + +new Date;
                window[w] = function (a) {
                    h && h(a)
                };
                x = [];
                x.push((b.jsonp || "callback") + "=" + w);
                i && g.iterate(i, function (a, b) {
                    x.push(b + "=" + encodeURIComponent(a))
                });
                x = x.join("&");
                a += a.indexOf("?") == -1 ? "?" + x : "&" + x;
                y = g.createElement("script");
                y.onload = function () {
                    delete window[w];
                    g.removeElement(y)
                };
                y.onerror = function () {
                    e && e();
                    delete window[w];
                    g.removeElement(y)
                };
                y.src = a;
                A.appendChild(y);
                return !0
            }
            b.update && (c = typeof b.update === "string" ? g.get(b.update) : b.update, h = function (a) {
                c.innerHTML = a.responseText
            });
            if ((s = window.location.search.match(/locale=(\w+)/)) && s.length == 2) s = s[1], k["Accept-Language"] = s;
            g.trace("XHR: " + a);
            f.open(d, a, !0);
            f.onreadystatechange = h ?
            function (a) {
                A.removeEventListener("offline", f.onerror, !1);
                f.readyState !== 4 ? g.trace("XHR state change: " + f.readyState) : (g.trace("XHR status: " + f.status), f.status === 200 ? h.call(j, a.target) : e && (B = !1, e.call(j, a.target)))
            } : null;
            f.onerror = f.onabort = function () {
                A.removeEventListener("offline", f.onerror, !1);
                B && e && e.call(j, {
                    status: 0,
                    statusText: "error"
                });
                B = !1
            };
            A.addEventListener("offline", f.onerror, !1);
            k && g.iterate(k, function (a, b) {
                f.setRequestHeader(b, a)
            });
            if (!("onLine" in navigator) || navigator.onLine) f.send(i);
            else f.onerror()
        }
    });
    f.augment(a.prototype, f);
    f.augment(a.prototype, h);
    f.augment(a.prototype, {
        cookie: function (a, b, c) {
            var f, d, h;
            if (typeof b != "undefined") {
                c = c || {};
                if (b === null) b = "", c.expires = -1;
                h = "";
                if (c.expires && (g.isNumber(c.expires) || c.expires.toUTCString)) g.isNumber(c.expires) ? (f = new Date, f.setTime(f.getTime() + c.expires * 864E5)) : f = c.expires, h = "; expires=" + f.toUTCString();
                f = c.path ? "; path=" + c.path : "";
                c = c.domain ? "; domain=" + c.domain : "";
                d = window.location.protocol === "https:" ? "; secure" : "";
                document.cookie = [a, "=", encodeURIComponent(b), h, f, c, d].join("")
            } else {
                b = null;
                if (document.cookie && document.cookie !== "") {
                    f = document.cookie.split(";");
                    for (h = 0; h < f.length; h++) if (c = g.trim(f[h]), c.substring(0, a.length + 1) == a + "=") {
                        b = decodeURIComponent(c.substring(a.length + 1));
                        break
                    }
                }
                return b
            }
        }
    });
    f.augment(a.prototype, j)
})(function () {});

// ****************** Setup event handling

TWITTER.add("event", function (a) {
    function g(a, b) {
        var c = "event_uid" + (b ? "0" : "1");
        if (a[c]) return a[c];
        a[c] = y++;
        return a[c]
    }
    function e(a) {
        switch (a.type) {
        case v:
            if (a.button) return !1;
            a.touches = [a];
            break;
        case t:
        case q:
            a.touches = [a]
        }
        return a
    }
    function d(b) {
        b = a.isObject(b) ? b.type : b;
        if (!x) switch (b) {
        case l:
            b = v;
            break;
        case m:
            b = t;
            break;
        case o:
            b = q
        }
        b == u && !(b in E ? !E[b] : 1) && (b = C);
        return b
    }
    function c(a, b, c, f, d) {
        this.el = a;
        this.type = b;
        this.fn = c;
        this.ctx = f || this.el;
        this.useCapture = d
    }
    function b(a, c, f, d) {
        b.superclass.constructor.apply(this, [a, s, c, f, d]);
        this.touches = {}
    }
    function f(a, b, c, d, e) {
        f.superclass.constructor.apply(this, [a, b, c, d, e]);
        this.touches = {}
    }
    function h(a, b, c, f) {
        h.superclass.constructor.apply(this, [a, p, b, c, f])
    }
    function j(a, b, c, f) {
        j.superclass.constructor.apply(this, [a, r, b, c, f])
    }
    function i(f, d, e, i, k) {
        i = i || f;
        f = typeof f === B ? a.get(f) : f;
        k = !! k;
        f && (d = d == r ? new j(f, e, i, k) : d == p ? new h(f, e, i, k) : x && d == s ? new b(f, e, i, k) : new c(f, d, e, i, k), d.attach(), f = g(f, k), k = w[f] || [], k.push(d), w[f] = k)
    }
    function k(b, c, f, e, h) {
        if (b) {
            e = g(b, h);
            var j, i, k;
            b = typeof b === B ? a.get(b) : b;
            h = !! h;
            if (b && (c = d(c), b = w[e])) {
                i = 0;
                k = b.length;
                for (; i < k; i++) if (j = b[i], c == d(j.type) && j.useCapture == h && (!f || j.fn === f)) j.deattach(), b.splice(i, 1), i--, k--, b.length || delete w[e]
            }
        }
    }
    function n() {
        (new b(A.body)).attach()
    }
    var l = "touchstart",
        m = "touchmove",
        o = "touchend",
        p = "flick",
        r = "swipe",
        q = "mouseup",
        t = "mousemove",
        v = "mousedown",
        u = "input",
        C = "keyup",
        s = "click",
        B = "string",
        A = document,
        y = 1,
        w = {},
        x = typeof window.ontouchstart !== "undefined",
        z = !1,
        D = !1,
        F = 30,
        G = 30,
        H = a.Browser.Android ? 50 : 25,
        E = {
            input: a.Browser.Apple && a.Browser.version < 4
        };
    c.prototype = {
        fire: function (a) {
            var b = this.fn;
            b && (a = e(a)) && (b.handleEvent && typeof b.handleEvent === "function" ? b.handleEvent.call(b, a) : b.call(this.ctx, a))
        },
        attach: function () {
            var b = d(this.type);
            this.listener = a.bind(this.fire, this);
            this.el.addEventListener(b, this.listener, this.useCapture)
        },
        deattach: function () {
            this.el.removeEventListener(d(this.type), this.listener, this.useCapture)
        }
    };
    a.extend(b, c, {
        attach: function () {
            this.listener = a.bind(this.handleEvent, this);
            this.el.addEventListener(l, this.listener, !1);
            this.el.addEventListener(m, this.listener, !1);
            this.el.addEventListener(o, this.listener, !1);
            this.el.addEventListener(s, this.listener, !1)
        },
        deattach: function () {
            var a = this.el;
            a.removeEventListener(l, this.listener, !1);
            a.removeEventListener(m, this.listener, !1);
            a.removeEventListener(o, this.listener, !1);
            a.removeEventListener(s, this.listener, !1)
        },
        handleEvent: function (a) {
            if (!this.handleActiveLink(a)) switch (a.type) {
            case l:
            case v:
                this.onTouchStart(a);
                break;
            case m:
            case t:
                this.onTouchMove(a);
                break;
            case o:
            case q:
                this.onTouchEnd(a);
                break;
            case s:
                this.onClick(a)
            }
        },
        handleActiveLink: function (b) {
            var c = this,
                f = b.currentTarget,
                d = b.target,
                e = a.getElementNode(d),
                h, j;
            if (d.activeLink !== !1) {
                if (e = !(e instanceof window.HTMLAnchorElement) && a.inheritsClass(d, "userselect", f)) d.activeLink = 2;
                else if (h = a.inheritsClass(d, "activeLink", f)) d.activeLink = 1;
                if (!h && !e) d.activeLink = !1;
                d.activeLink = 1;
            }
            if (d.activeLink === !1) return !1;
            if (D && f instanceof window.HTMLBodyElement) return b.preventDefault(), b.stopPropagation(), !0;
            d.activeLink == 2 && b.type == l && (f.removeEventListener(s, c.listener, !1), j = function () {
                f.addEventListener(s, c.listener, !1);
                f.removeEventListener(o, j, !1)
            }, f.addEventListener(o, j, !1));
            b.type == s && this.fire(b);
            return !0
        },
        onTouchStart: function (a) {
            a = a.touches ? a.touches[0] : a;
            this.touches.startTime = (new Date).getTime();
            this.touches.pageX = a.clientX;
            this.touches.pageY = a.clientY;
            this.touches.startClientPosX = a.clientX;
            this.touches.startClientPosY = a.clientY;
            this.touches.isDragging = !1;
            this.touches.touchClick = !1;
            if (!this.touches.endTime) this.touches.endTime = 0;
            if (!this.touches.clickTime) this.touches.clickTime = 0
        },
        onTouchMove: function (a) {
            a = a.touches ? a.touches[0] : a;
            if (!this.touches.isDragging && (Math.abs(a.clientY - this.touches.startClientPosY) > 10 || Math.abs(a.clientX - this.touches.startClientPosX) > 10)) this.touches.isDragging = !0
        },
        onTouchEnd: function (b) {
            var c = a.getElementNode(b.target);
            if (z === !1 && !this.touches.isDragging && (b.preventDefault(), b.stopPropagation(), (new Date).getTime() > this.touches.endTime + 500)) {
                if (c instanceof window.HTMLInputElement || c instanceof
                window.HTMLTextAreaElement) b = document.createEvent("HTMLEvents"), b.fakeEvent = !0, b.initEvent("focus", !1, !1), c.dispatchEvent(b), c.focus();
                b = document.createEvent("MouseEvent");
                D = b.touchClick = !0;
                setTimeout(function () {
                    D = !1
                }, 500);
                this.touches.endTime = (new Date).getTime();
                b.initMouseEvent("click", !0, !0, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
                c.dispatchEvent(b)
            }
        },
        onClick: function (b) {
            var c = a.getElementNode(b.target);
            if (b.touchClick && (new Date).getTime() > this.touches.clickTime + 500) return this.touches.clickTime = (new Date).getTime(), this.fire(b), !0;
            else!(c instanceof window.HTMLInputElement) && !(c instanceof window.HTMLTextAreaElement) && (b.preventDefault(), b.stopPropagation())
        }
    });
    a.extend(f, c, {
        attach: function () {
            this.listener = a.bind(this.handleEvent, this);
            this.el.addEventListener(d(l), this.listener, !1);
            this.el.addEventListener(d(m), this.listener, !1);
            this.el.addEventListener(d(o), this.listener, !1)
        },
        deattach: function () {
            this.el.removeEventListener(d(l), this.listener, !1);
            this.el.removeEventListener(d(m), this.listener, !1);
            this.el.removeEventListener(d(o), this.listener, !1);
            f.superclass.deattach.apply(this, [])
        },
        fire: function (b, c, d) {
            var e = {};
            e.preventDefault = function () {
                c.preventDefault()
            };
            e.stopPropagation = function () {
                c.stopPropagation()
            };
            a.iterate(event, function (a, b) {
                e[b] = a
            });
            a.iterate(event.touches[0], function (a, b) {
                e[b] = a
            });
            if (d) e.distance = d, e.time = +new Date - (this.touchstartTime || 0), e.velocity = d / e.time, e.direction = d > 0 ? "Right" : "Left";
            e.type = this.type;
            f.superclass.fire.apply(this, [e]);
            return e.cancelBubble
        },
        handleEvent: function (a) {
            e(a);
            if (e(a)) switch (a.type) {
            case l:
            case v:
                this.onTouchStart(a);
                break;
            case m:
            case t:
                this.onTouchMove(a);
                break;
            case o:
            case q:
                this.onTouchEnd(a)
            }
        }
    });
    a.extend(h, f, {
        onTouchStart: function (a) {
            this.touchstartEvt = a;
            this.touchstartTime = +new Date;
            this.firstY = this.lastY = this.pastY = this.touchstartEvt.touches[0].clientY;
            this.firstX = this.lastX = this.pastX = this.touchstartEvt.touches[0].clientX
        },
        onTouchMove: function (a) {
            if (this.lastY !== a.touches[0].clientY) this.pastY = this.lastY;
            if (this.lastX !== a.touches[0].clientX) this.pastX = this.lastX;
            this.lastY = a.touches[0].clientY;
            this.lastX = a.touches[0].clientX;
            this.touchLastMove = +new Date
        },
        onTouchEnd: function (a) {
            var b, c, f, d, e, h;
            b = this.firstX - this.lastX;
            f = Math.abs(b);
            c = this.firstY - this.lastY;
            d = Math.abs(c);
            e = +new Date;
            this.touchstartEvt && d > f && (z && clearTimeout(z), h = Math.abs(this.pastY - this.lastY), e -= this.touchLastMove, e < H && h >= 8 ? (this.fire(p, a, d >= f ? c : b), z = setTimeout(function () {
                z = !1
            }, 1E3)) : z && (z = setTimeout(function () {
                z = !1
            }, 500)));
            this.lastY = this.firstY = this.lastX = this.firstX = 0;
            this.touchstartEvt = this.pastY = this.pastX = null
        }
    });
    a.extend(j, f, {
        onTouchStart: function (a) {
            this.touchMoveEvt = null;
            this.touchstartEvt = a;
            this.touchstartTime = +new Date;
            this.firstY = this.lastY = this.touchstartEvt.touches[0].clientY;
            this.firstX = this.lastX = this.touchstartEvt.touches[0].clientX
        },
        onTouchMove: function (a) {
            function b() {
                var a = Math.abs(h.pastX - h.lastX);
                return e - h.pastTs < G && a > F
            }
            var c, f, d, e, h = this;
            e = +new Date;
            if (this.lastY !== a.touches[0].clientY) this.pastY = this.lastY;
            if (this.lastX !== a.touches[0].clientX) this.pastX = this.lastX;
            if (this.pastTs !== e) this.pastTs = e;
            this.lastY = a.touches[0].clientY;
            this.lastX = a.touches[0].clientX;
            this.touchMoveEvt = a;
            c = this.firstX - this.lastX;
            f = Math.abs(c);
            d = Math.abs(this.firstY - this.lastY);
            if (this.touchstartEvt && !this.swipe && f > d && (b() || e - h.touchstartTime < 100 && f > 100)) this.swipe = this.fire(r, a, c)
        },
        onTouchEnd: function () {
            this.swipe = !1;
            this.lastY = this.firstY = this.lastX = this.firstX = 0;
            this.touchMoveEvt = this.touchstartEvt = this.pastY = this.pastX = null
        }
    });
    document.body ? n() : A.addEventListener("DOMContentLoaded", n, !0);
    a.register("event", {
        on: i,
        one: function (a, b, c, f, d) {
            var e = function () {
                    c.handleEvent && typeof c.handleEvent === "function" ? c.handleEvent.apply(c, arguments) : c.apply(f || c, arguments);
                    k(a, b, e, f, d)
                };
            i(a, b, e, f, d)
        },
        removeEventListener: k
    }, "Event", {
        bundle: 1
    })
});


// ************** Scrollview widget



TWITTER.add("scrollview", function (a) {
    function g(d) {
        d = d || {};
        if (!d[c]) throw Error("ScrollView requires an element");
        this[c] = a.get(d[c]);
        this[b] = d[b] || "100%";
        this[f] = d[f] || null;
        this[h] = d[h] || "y";
        this[j] = d[j] || !1;
        this[j] && (this[h] = "x");
        this[j] && d[i] && (this[i] = d[i]);
        this[h] === "x" ? this[l] = !0 : this[m] = !0;
        this[k] = d[k] === !0 ? !0 : !1;
        this[n] = d[n] === !0 ? !0 : !1;
        this.callback = d.callback || {};
        this.initialize()
    }
    var e = null,
        d = 0,
        c = "element",
        b = "size",
        f = "sizes",
        h = "axis",
        j = "pagingEnabled",
        i = "paginator",
        k = "bounceVertical",
        n = "bounceHorizontal",
        l = "scrollsHorizontal",
        m = "scrollsVertical",
        pulldown = {element : null, pulling : 0, timer : 0};
        
    g.prototype = {
        handleEvent: function (a) {
            switch (a.type) {
            case "webkitTransitionEnd":
                this.onTransitionEnd(a);
                break;
            case "touchstart":
            case "mousedown":
                this.onTouchStart(a);
                break;
            case "touchmove":
            case "mousemove":
                this.onTouchMove(a);
                this.pulldownMove(a);
                break;
            case "touchend":
            case "mouseup":
                this.onTouchEnd(a);
                this.pulldownEnd(a);
                break;
            case "click":
                this.onClick(a);
                break;
            case "flick":
                this.onFlick(a)
            }
        },
        preCalculateOffsets: function () {
            var b = this[c],
                f = this[i].pageSelector,
                d = [];
            b = f ? a.getAll(f, b) : b.children;
            a.each(b, function (a) {
                d.push(a.offsetLeft)
            }, this);
            this._minPoints = d;
            this._minPoints.length === 1 && this._minPoints.push(this._minPoints[this._minPoints.length - 1]);
            this.touches.minPosX = -this._minPoints[this[i].currentPage - 1];
            this.touches.maxPosX = -this._minPoints[this[i].currentPage]
        },
        getTouchInfo: function () {
            return this.touches
        },
        setSize: function (a) {
            this[a] = a;
            if (this[h] === "x") this[c].style.width = this[a] + "px";
            else if (this[h] === "y") this[c].style.height = this[a] + "px"
        },
        resize: function () {
            var a = this[c].parentNode.cloneNode(!0),
                f = document.body.className;
            if (this[h] === "x") this[c].style.width = "";
            else if (this[h] === "y") this[c].style.height = "";
            a.style.display = "block";
            document.body.className = "";
            document.body.appendChild(a);
            this[b] = a.offsetHeight;
            document.body.removeChild(a);
            if (f) document.body.className = f
        },
        onOrientationChange: function () {
            if (!this.autoresize && !this[f]) return !1;
            if (this[h] === "x") this[c].style.width = "";
            else if (this[h] === "y") this[c].style.height = "";
            setTimeout(a.bind(function () {
                this.touches.isTouching = !1;
                this.touches.isDragging = !1;
                this.scrollHost.lastScrollHeight = -1;
                if (this[j]) this._minPoints = null, this.preCalculateOffsets(), this.scrollTo(this.touches.minPosX, this.touches.translations[1].y);
                this[f] ? this[b] = window.innerWidth >= 1024 ? this[f].landscape : this[f].portrait : this[c].parentNode ? (this[b] = this[h] === "y" ? this[c].parentNode.offsetHeight : this[c].parentNode.offsetWidth, this[b] === 0 && this.resize()) : this[b] = this[h] === "x" ? window.innerWidth : window.innerHeight;
                this[h] === "x" ? this[c].style.width = this[b] + "px" : this[c].style.height = this[b] + "px"
            }, this), 100)
        },
        onTransitionEnd: function () {
            this[j] && this.updatePage()
        },
        onClick: function (a) {
            a.fakeEvent || (a.preventDefault(), a.stopPropagation())
        },
        onTouchStart: function (b) {
            if (!b.touches || b.touches && b.touches.length == 1) {
                this.flicking = !! e;
                this.stopAnimation(!0);
                this.touches.translations = [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 0
                }];
                this.scrollingY = this.scrollingX = !1;
                var f = a.getAncestorByClassName(b.target, "tw-scrollview-host", this.scrollHost),
                    d = a.getAncestorByClassName(b.target, "userselect", this.scrollHost);
                this.nestedScrollTarget = f !== this.scrollHost ? !0 : !1;
                a.on(document, "touchend", this, !0);
                this.touches.target = b.target;
                if (this.touches.stopScroll) return !1;
                f = b.touches ? b.touches[0] : b;
                this.touches.startTime = (new Date).getTime();
                this.touches.pageX = f.clientX;
                this.touches.pageY = f.clientY;
                this.touches.startClientPosX = f.clientX;
                this.touches.startClientPosY = f.clientY;
                this.touches.isTouching = !1;
                this.touches.isDragging = !1;
                if (!d) {
                    for (d = b.target; d.nodeType != 1;) d = d.parentNode;
                    d instanceof window.HTMLInputElement || d instanceof window.HTMLTextAreaElement || b.preventDefault()
                }
                window.scrollTo(0, 0);
                a.on(this[c], "touchmove", this)
            }
        },
        onTouchMove: function (f) {
            if (!this.touches.stopScroll) {
                var d, e, h, k;
                if (!((new Date).getTime() < this.touches.startTime)) {
                    if (!this.touches.isTouching && !(f.target instanceof window.HTMLInputElement) && (!f.touches || f.touches && f.touches.length === 1)) {
                        d = this.scrollHost.scrollHeight;
                        e = this.scrollHost.scrollWidth;
                        h = a.getCurrentTransform(this.scrollHost);
                        k = h[0];
                        h = h[1];
                        this.touches.startPosX = this.touches.startClientPosX - k;
                        this.touches.startPosY = this.touches.startClientPosY - h;
                        this.touches.isTouching = !0;
                        this.touches.isDragging = !1;
                        if (this[m]) {
                            k = -d;
                            if (this.autoresize && d != this.scrollHost.lastScrollHeight) this.calculateSize(), this.scrollHost.lastScrollHeight = d;
                            this.touches.maxPosY = k + this[b];
                            if (Math.abs(k) <= this.touches.maxPosY || this.touches.maxPosY > 0) this.touches.maxPosY = 0;
                            this[l] = !1;
                            e > this[c].offsetWidth && (this[l] = !0);
                            this.touches.scrollHeight = d
                        }
                        if (this[l]) this[m] ? this.touches.maxPosX = (e - this[c].offsetWidth) * -1 : this[j] ? (this._minPoints || this.preCalculateOffsets(), this.touches.minScrollX = this._minPoints[this[i].currentPage - 1] >= 0 ? this._minPoints[this[i].currentPage - 1] : this._minPoints[this[i].currentPage], this.touches.maxScrollX = this._minPoints[this[i].currentPage + 1]) : (this.touches.minPosX = 0, this.touches.maxPosX = (e - this[b]) * -1, e < this[b] && (this.touches.maxPosX = 0))
                    }
                    if (this.touches.isTouching && (!f.touches || f.touches && f.touches.length === 1)) {
                        d = f.touches ? f.touches[0] : f;
                        e = d.clientX - this.touches.startPosX;
                        k = d.clientY - this.touches.startPosY;
                        this[l] || (e = 0);
                        this[m] || (k = 0);
                        if (!this.scrollingX && Math.abs(d.clientY - this.touches.startClientPosY) > 10) this.scrollingY = !0, this.touches.isDragging = !0;
                        else if (!this.scrollingY && Math.abs(d.clientX - this.touches.startClientPosX) > 10) this.scrollingX = !0, this.touches.isDragging = !0;
                        f.preventDefault();
                        if ((!this.scrollingY && this[m] || !this.scrollingX && this[l]) && (!this[l] || !this[m])) return !1;
                        this[m] && (k > 0 ? k *= 0.4 : k < this.touches.maxPosY && (k -= 2 * (k - this.touches.maxPosY) * 0.4));
                        this[l] && (e > 0 ? e *= 0.4 : e < this.touches.maxPosX && (e -= (e - this.touches.maxPosX) * 0.4));
                        if (this[m] && this[l]) {
                            if (this.nestedScrollTarget) return;
                            if (Math.abs(d.clientX - this.touches.startClientPosX) <= 10) this.touches.lockToAxis = "y";
                            else if (Math.abs(d.clientY - this.touches.startClientPosY) <= 10) this.touches.lockToAxis = "x";
                            if (this.touches.lockToAxis === "y") e = this.touches.translations[1].x;
                            else if (this.touches.lockToAxis === "x") k = this.touches.translations[1].y;
                            e > 0 ? e = 0 : e < this.touches.maxPosX && (e = this.touches.maxPosX)
                        }
                        this.touches.lastMoved = (new Date).getTime();
                        this.scrollTo(e, k, 0);
                        a.isFunction(this.callback.scroll) && this.callback.scroll()
                    }
                }
            }
        },
        onTouchEnd: function (b) {
            var f;
            a.removeEventListener(this[c], "touchmove", this);
            setTimeout(a.bind(function () {
                a.removeEventListener(document, "touchend", this, !0)
            }, this), 0);
            if (this.touches.isDragging) {
                if (!this[j] && (+new Date - this.touches.lastMoved > 75 || this.scrollingY && Math.abs(this.touches.translations[1].y - this.touches.translations[0].y) <= 10 || this.scrollingX && Math.abs(this.touches.translations[1].x - this.touches.translations[0].x) <= 10)) this[m] && this.touches.translations[1].y > 0 ? this.scrollTo(this.touches.translations[1].x, 0, 300) : this[m] && this.touches.translations[1].y < this.touches.maxPosY ? this.scrollTo(this.touches.translations[1].x, this.touches.maxPosY, 300) : this[l] && this.touches.translations[1].x > 0 ? this.scrollTo(0, this.touches.translations[1].y, 300) : this[l] && this.touches.translations[1].x < this.touches.maxPosX && this.scrollTo(this.touches.maxPosX, this.touches.translations[1].y, 300), this.touches.lockToAxis = null, this.touches.isDragging = !1
            } else if (!this.flicking) if (a.contains(this.element, b.target)) {
                b.cancelBubble = !0;
                for (f = b.target; f.nodeType != 1;) f = f.parentNode;
                if (f instanceof window.HTMLInputElement || f instanceof window.HTMLTextAreaElement) b = document.createEvent("HTMLEvents"), b.fakeEvent = !0, b.initEvent("focus", !1, !1), f.dispatchEvent(b), f.focus();
                b = document.createEvent("MouseEvent");
                b.fakeEvent = !0;
                b.initMouseEvent("click", !0, !0, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
                f.dispatchEvent(b);
                this.touches.lockToAxis = null
            } else b.preventDefault(), b.stopPropagation()
        },
        pulldownMove:function (b) {
          var a;
           a = this.getTouchInfo();
           a = a.translations;
           if (pulldown.moving && a.length && a[0].y > 50) {
               if (pulldown.pulling === 0) pulldown.pulling = 1, this.toggleRefreshText();
               pulldown.lastTranslation = a[0].y;
               return
           }
           if (pulldown.moving && a.length && a[a.length - 1].y > 0 && a[a.length - 1].y < pulldown.lastTranslation) {
              if (pulldown.pulling === 1) pulldown.pulling = 0, this.toggleRefreshText();
               return
           }
          pulldown.moving = !0  
        },
        pulldownEnd: function(b) {
          var c;
          if (pulldown.moving && (pulldown.moving = !1, pulldown.pulling = 0, (c = this.getTouchInfo(), c.translations.length && c.translations[0].y > 50))) pulldown.pulling = 2, this.toggleRefreshText(), setTimeout(a.bind(function () {
              a.setStyle(this.scrollHost, "-webkit-transform", "translate3d(0px,60px,0)")
          }, this), 10), setTimeout(a.bind(function () {
              console.log("FIRING PULL REFRESH");
          }, this), 750), $(this.scrollHost).trigger('pulledDown'), pulldown.pulling = 0          
        },
        toggleRefreshText: function() {
          console.log("Changing refresh text...");
        },
        onFlick: function (b) {
            if (this.touches.isDragging && !this.touches.stopScroll) this[m] && this.touches.lockToAxis === "x" ? this.touches.lockToAxis = null : (d = b.velocity, this.decelerationConst = 0.94, this[j] ? (this.decelerationConst = 1, d > 0 ? this[i].currentPage <= this[i].pages - 1 ? this.nextPage() : this.scrollTo(this.touches.maxPosX, this.touches.translations[1].y, 400, "ease-out") : this[i].currentPage > 1 ? this.prevPage() : this.scrollTo(0, this.touches.translations[1].y, 400, "ease-out")) : (e = setInterval(a.bind(this.animateScroll, this), 15), this.touches.lockToAxis = null))
        },
        animateScroll: function () {
            var b = !1,
                f, c, e, h = {
                    x: this.touches.translations[1].x,
                    y: this.touches.translations[1].y
                };
            c = this[m] ? this.touches.maxPosY : this.touches.maxPosX;
            e = this[j] ? 0 : 150;
            d *= this.decelerationConst;
            f = d * 40;
            this[m] ? h.y -= f : this[l] && (h.x -= f);
            if (this[m] && h.y > 0) {
                if (d *= 0.7, this._didScrollPastLowerBoundary || (this._didScrollPastLowerBoundary = !0), h.y > e) b = !0, this.stopAnimation(), h.y = e
            } else if (this[l] && h.x > 0) {
                d *= 0.7;
                if (!this._didScrollPastLowerBoundary && (this._didScrollPastLowerBoundary = !0, a.isFunction(this.callback.onLowerBoundary))) this.callback.onLowerBoundary();
                if (h.x > e) b = !0, this.stopAnimation(), h.x = e
            } else if (this[m] && h.y < c) {
                d *= 0.7;
                if (!this._didScrollPastUpperBoundary && (this._didScrollPastUpperBoundary = !0, a.isFunction(this.callback.onUpperBoundary))) this.callback.onUpperBoundary();
                if (h.y < this.touches.maxPosY - e) b = !0, this.stopAnimation(), h.y = this.touches.maxPosY - e
            } else if (this[l] && h.x < c && (d *= 0.7, this._didScrollPastUpperBoundary || (this._didScrollPastUpperBoundary = !0), h.x < this.touches.maxPosX - e)) b = !0, this.stopAnimation(), h.x = this.touches.maxPosX - e;
            Math.abs(f.toFixed(4)) < 0.9 && (b = !0, d = 0, this.stopAnimation());
            b || this.scrollTo(h.x, h.y, 0)
        },
        stopAnimation: function (a) {
            if (e) {
                var b = {
                    x: this.touches.translations[1].x,
                    y: this.touches.translations[1].y
                };
                clearInterval(e);
                if (this._didScrollPastLowerBoundary) {
                    if (this[m]) b.y = 0;
                    if (this[l] && !this[m]) b.x = 0;
                    this.scrollTo(b.x, b.y, 400, "ease-out");
                    this._didScrollPastLowerBoundary = !1
                } else if (this._didScrollPastUpperBoundary) {
                    if (this[m]) b.y = this.touches.maxPosY;
                    if (this[l] && !this[m]) b.x = this.touches.maxPosX;
                    this.scrollTo(b.x, b.y, 400, "ease-out");
                    this._didScrollPastUpperBoundary = !1
                } else this[j] && !a && this.updatePage()
            }
            e = null
        },
        updatePage: function () {
            if (this[i][c]) for (var b = 0, f; b < this[i].pages; b++) f = this[i][c].children[b], b === this[i].currentPage - 1 ? a.addClass(f, "tw-active") : a.removeClass(f, "tw-active");
            this[i].callback && this[i].callback.pageChange && this[i].callback.pageChange(this[i].currentPage)
        },
        nextPage: function (a) {
            a = a === !1 ? 0 : 400;
            if (this[i].currentPage >= this[i].pages) return !1;
            this[i].currentPage++;
            this._minPoints || this.preCalculateOffsets();
            this.touches.minPosX = -this._minPoints[this[i].currentPage - 2];
            this.touches.maxPosX = -this._minPoints[this[i].currentPage - 1];
            this.scrollTo(this.touches.maxPosX, this.touches.translations[1].y, a, "ease-out");
            a || this.updatePage()
        },
        prevPage: function (a) {
            a = a === !1 ? 0 : 400;
            if (this[i].currentPage <= 1) return !1;
            this[i].currentPage--;
            this._minPoints || this.preCalculateOffsets();
            this.touches.minPosX = -this._minPoints[this[i].currentPage];
            this.touches.maxPosX = -this._minPoints[this[i].currentPage - 1];
            this.scrollTo(this.touches.maxPosX, this.touches.translations[1].y, a, "ease-out");
            a || this.updatePage()
        },
        scrollTo: function (b, f, c, d) {
            var e = b !== null ? Math.round(b) : 0,
                h = f !== null ? Math.round(f) : 0,
                j = this.callback.scroll;
            c = c || 0;
            d = d || "cubic-bezier(0.42, 0, 0.58, 1.0)";
            this.touches.translations.splice(0, 1);
            this.touches.translations.push({
                x: b,
                y: f
            });
            a.setStyle(this.scrollHost, "-webkit-transition", "");
            c !== 0 ? (c = {
                easing: d,
                duration: c,
                transform: ["translate3d(", e, "px,", h, "px,0)"].join("")
            }, a.trace("Transition: duration, easing:" + [c.duration, c.easing]), a.setStyle(this.scrollHost, "-webkit-transition", ["-webkit-transform", c.duration + "ms", c.easing].join(" ")), a.setStyle(this.scrollHost, "-webkit-transform", c.transform)) : a.setStyle(this.scrollHost, "-webkit-transform", ["translate3d(", e, "px,", h, "px,0)"].join(""));
            a.isFunction(j) && j(b, f)
        },
        lockScroll: function () {
            this.touches.stopScroll = !0
        },
        unlockScroll: function () {
            this.touches.stopScroll = !1
        },
        isLocked: function () {
            return this.touches.stopScroll
        },
        getElement: function () {
            return this[c]
        },
        getScrollHost: function () {
            return this.scrollHost
        },
        getScrollOffsets: function () {
            var a = {
                x: 0,
                y: 0
            },
                b = [0, 0, 0],
                f = this.scrollHost.style.webkitTransform.replace(/translate(3d)?\(/, "").split(",");
            f.length > 1 && (b[0] = parseInt(f[0], 10), b[1] = parseInt(f[1], 10), b[2] = parseInt(f[2], 10));
            a.x = b[0];
            a.y = b[1];
            return a
        },
        initPager: function () {
            var f, d, e;
            if (this[i] && this[i].pageSelector) f = 8, a.each(a.getAll(this[i].pageSelector, this[c]), function (c) {
                c.style.display = "inline-block";
                c.style.width = this[b] + "px";
                f += this[b];
                if (a.Browser.Apple) c.style.webkitTransform = "translate3d(0,0,0)"
            }, this), this.scrollHost.style.width = f + "px", this[c].style.whiteSpace = "nowrap", this.touches.maxPosX = -f + this[b];
            if (this[i] && (this[i].pages = this[i].pages || a.getAll(this[i].pageSelector, this[c]).length, this[i].currentPage = this[i].currentPage || 1, this[i][c])) {
                this[i][c] = a.get(this[i][c]);
                a.addClass(this[i][c], "tw-paginator");
                this[i][c].innerHTML = "";
                for (d = 0; d < this[i].pages; d++) e = a.createElement("span", {
                    className: "tw-paginator-page"
                }), d === this[i].currentPage - 1 && a.addClass(e, "tw-active"), this[i][c].appendChild(e);
                a.on(this[i][c], "click", this)
            }
        },
        calculateSize: function () {
            if (this[b]) {
                if (this[b] === "100%" || this.autoresize) {
                    this.autoresize = !0;
                    a.setStyle(this[c], "overflow", null);
                    this[h] === "x" ? a.setStyle(this[c], "width", null) : a.setStyle(this[c], "height", null);
                    var d = a.getXY(this[c]);
                    this[h] === "y" ? (this[b] = window.innerHeight, this[b] -= d[1]) : (this[b] = window.innerWidth, this[b] -= d[0]);
                    this[b] <= 0 && (this[b] = this[h] === "x" ? window.innerWidth : window.innerHeight)
                }
                this[h] === "x" ? (this[c].style.width = this[b] + "px", this[c].style.overflowX = "hidden") : (this[f] ? window.innerWidth >= 1024 ? (this[c].style.height = this[f].landscape + "px", this[b] = this[f].landscape) : (this[c].style.height = this[f].portrait + "px", this[b] = this[f].portrait) : this[c].style.height = this[b] + "px", this[c].style.overflowY = "hidden")
            }
        },
        initialize: function () {
            this.touches = {
                target: null,
                pageX: 0,
                pageY: 0,
                isTouching: !1,
                isDragging: !1,
                startPosX: 0,
                startPosY: 0,
                translations: [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 0
                }],
                lastMoved: 0,
                maxPos: 0,
                stopScroll: !1
            };
            this.wrapper = a.createElement("div");
            this.wrapper.style.position = "relative";
            this.wrapper.style.zIndex = "0";
            this.scrollHost = a.createElement("div");
            this.scrollHost.className = "tw-scrollview-host";
            this.wrapper.appendChild(this.scrollHost);
            var f = [],
                d, e;
            d = 0;
            for (e = this[c].childNodes.length; d < e; d++) f.push(this[c].childNodes[d]);
            d = 0;
            for (e = f.length; d < e; d++) this.scrollHost.appendChild(f[d]);
            this[c].appendChild(this.wrapper);
            this.calculateSize();
            if (this.autoresize) a.on(window, "orientationchange", this.onOrientationChange, this);
            this.wrapper.scrollWidth > this[c].parentNode.scrollWidth && (this[l] = !0);
            this[j] && this.initPager();
            this[i] && this[i].currentPage > 1 ? (this[i].currentPage--, this.nextPage(!1)) : this.scrollTo(0, 0, 0);
            this[b] === 0 && this.resize();
            this.attachEventListeners()
        },
        attachEventListeners: function () {
            if (this[c] && !this.eventsAttached) this.eventsAttached = !0, a.on(this[c], "touchstart", this), a.on(this[c], "webkitTransitionEnd", this), a.on(this[c], "click", this, this, !0), a.on(this[c], "flick", this, this, !0)
        },
        removeEventListeners: function () {
            if (this[c]) this.eventsAttached = !1, a.removeEventListener(this[c], "touchstart", this), a.removeEventListener(this[c], "webkitTransitionEnd", this), a.removeEventListener(this[c], "click", this, this, !0), a.removeEventListener(this[c], "flick", this, this, !0)
        }
    };
    a.register("scrollview", g, "ScrollView")
});