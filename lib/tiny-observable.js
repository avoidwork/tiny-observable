/**
 * Tiny Observable for Client and Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2015
 * @license BSD-3-Clause
 * @link http://avoidwork.github.io/tiny-observable
 * @version 1.0.0
 */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global) {

	var WeakMap = global.WeakMap || require("es6-weak-map");
	var r = [8, 9, "a", "b"];

	function has(obj, prop) {
		return obj[prop] !== undefined;
	}

	function array(obj) {
		return obj instanceof Array ? obj : has(obj, "length") ? Array.from(obj) : [obj];
	}

	function iterate(obj, fn) {
		var ctx = arguments.length <= 2 || arguments[2] === undefined ? obj : arguments[2];
		return (function () {
			Object.keys(obj).forEach(function (i, idx) {
				fn.call(ctx, i, idx);
			});
		})();
	}

	function s() {
		return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}

	function uuid() {
		return s() + s() + "-" + s() + "-4" + s().substr(0, 3) + "-" + r[Math.floor(Math.random() * 4)] + s().substr(0, 3) + "-" + s() + s() + s();
	}

	var Observable = (function () {
		function Observable() {
			var arg = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

			_classCallCheck(this, Observable);

			this.limit = arg;
			this.listeners = {};
			this.hooks = new WeakMap();
		}

		_createClass(Observable, [{
			key: "dispatch",
			value: function dispatch(ev) {
				var _this = this;

				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				if (ev && has(this.listeners, ev)) {
					iterate(this.listeners[ev], function (i) {
						var obj = _this.listeners[ev][i];

						obj.handler.apply(obj.scope, args);
					});
				}

				return this;
			}
		}, {
			key: "hook",
			value: function hook(target, ev) {
				var _this2 = this;

				var ltarget = array(target);

				ltarget.forEach(function (t) {
					var obj = undefined;

					if (!has(t, "addEventListener")) {
						throw new Error("Invalid Arguments");
					}

					obj = _this2.hooks.get(t) || {};

					if (!has(obj, ev)) {
						obj[ev] = function (arg) {
							_this2.dispatch(ev, arg);
						};
					}

					_this2.hooks.set(t, obj);
					t.addEventListener(ev, _this2.hooks.get(t)[ev], false);
				});

				return this;
			}
		}, {
			key: "off",
			value: function off(ev, id) {
				if (has(this.listeners, ev)) {
					if (id) {
						delete this.listeners[ev][id];
					} else {
						delete this.listeners[ev];
					}
				}

				return this;
			}
		}, {
			key: "on",
			value: function on(ev, handler) {
				var id = arguments.length <= 2 || arguments[2] === undefined ? uuid() : arguments[2];
				var scope = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

				if (!has(this.listeners, ev)) {
					this.listeners[ev] = {};
				}

				if (Object.keys(this.listeners[ev]).length >= this.limit) {
					throw new Error("Possible memory leak, more than " + this.limit + " listeners for event: " + ev);
				}

				this.listeners[ev][id] = {
					scope: scope || this,
					handler: handler
				};

				return this;
			}
		}, {
			key: "once",
			value: function once(ev, handler) {
				var _this3 = this;

				var id = arguments.length <= 2 || arguments[2] === undefined ? uuid() : arguments[2];
				var scope = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

				var lscope = scope || this;

				return this.on(ev, function () {
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					handler.apply(lscope, args);
					_this3.off(ev, id);
				}, id, lscope);
			}
		}, {
			key: "unhook",
			value: function unhook(target, ev) {
				var _this4 = this;

				var ltarget = array(target);

				ltarget.forEach(function (t) {
					var obj = undefined;

					if (!has(t, "removeEventListener")) {
						throw new Error("Invalid Arguments");
					}

					obj = _this4.hooks.get(t);

					if (obj) {
						t.removeEventListener(ev, obj[ev], false);
						delete obj[ev];

						if (Object.keys(obj).length === 0) {
							_this4.hooks["delete"](t);
						} else {
							_this4.hooks.set(t, obj);
						}
					}
				});

				return this;
			}
		}]);

		return Observable;
	})();

	function factory(arg) {
		return new Observable(arg);
	}

	factory.version = "1.0.0";

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = factory;
	} else if (typeof define === "function") {
		define(function () {
			return factory;
		});
	} else {
		global.observable = factory;
	}
})(typeof window !== "undefined" ? window : global);
