/**
 * Iterates an Object and executes `fn` against the keys with index position as a second argument
 *
 * @param {Object}   obj Object to iterate
 * @param {Function} fn  Function to execute
 * @param {Object}   ctx [Optional] Context for the function execution, defaults to `obj`
 */
function iterate (obj, fn, ctx = obj) {
	Object.keys(obj).forEach((i, idx) => {
		fn.call(ctx, i, idx);
	});
}

class Observable {
	/**
	 * Creates a new Observable
	 *
	 * @constructor
	 * @memberOf keigai
	 * @param  {Number} arg Maximum listeners, default is 10
	 * @example
	 * let observer = observable( 50 );
	 */
	constructor (arg = 10) {
		this.limit = arg;
		this.listeners = {};
		this.hooks = new WeakMap();
	}

	/**
	 * Dispatches an event, with optional arguments
	 *
	 * @method dispatch
	 * @memberOf Observable
	 * @return {Object} {@link Observable}
	 * @example
	 * observer.dispatch( "event", ... );
	 */
	dispatch (ev, ...args) {
		if (ev && this.listeners[ev]) {
			iterate(this.listeners[ev], function (i) {
				i.handler.apply(i.scope, args);
			});
		}

		return this;
	}

	/**
	 * Hooks into `target` for a DOM event
	 *
	 * @method hook
	 * @memberOf Observable
	 * @param  {Object} target Element
	 * @param  {String} ev     Event
	 * @return {Object}        Element
	 * @example
	 * observer.hook( document.querySelector( "a" ), "click" );
	 */
	hook (target, ev) {
		if (typeof target.addEventListener !== "function") {
			throw new Error("Invalid Arguments");
		}

		let obj = this.hooks.get(target) || {};

		if (!obj[ev]) {
			obj[ev] = arg => {
				this.dispatch(ev, arg);
			};
		}

		this.hooks.set(target, obj);
		target.addEventListener(ev, this.hooks.get(target)[ev], false);

		return target;
	}

	/**
	 * Removes all, or a specific listener for an event
	 *
	 * @method off
	 * @memberOf Observable
	 * @param {String} ev Event name
	 * @param {String} id [Optional] Listener ID
	 * @return {Object} {@link Observable}
	 * @example
	 * observer.off( "click", "myHook" );
	 */
	off (ev, id) {
		if (this.listeners[ev]) {
			if (id) {
				delete this.listeners[ev][id];
			} else {
				delete this.listeners[ev];
			}
		}

		return this;
	}

	/**
	 * Adds a listener for an event
	 *
	 * @method on
	 * @memberOf Observable
	 * @param  {String}   ev      Event name
	 * @param  {Function} handler Handler
	 * @param  {String}   id      [Optional] Handler ID
	 * @param  {String}   scope   [Optional] Handler scope, default is `this`
	 * @return {Object} {@link Observable}
	 * @example
	 * observer.on( "click", function ( ev ) {
	 *   ...
	 * }, "myHook" );
	 */
	on (ev, handler, id = uuid(), scope = undefined) {
		if (!this.listeners[ev]) {
			this.listeners[ev] = {};
		}

		if (Object.keys(this.listeners[ev]).length >= this.limit) {
			throw(new Error("Possible memory leak, more than " + this.limit + " listeners for event: " + ev));
		}

		this.listeners[ev][id] = {scope: scope || this, handler: handler};

		return this;
	}

	/**
	 * Adds a short lived listener for an event
	 *
	 * @method once
	 * @memberOf Observable
	 * @param  {String}   ev      Event name
	 * @param  {Function} handler Handler
	 * @param  {String}   id      [Optional] Handler ID
	 * @param  {String}   scope   [Optional] Handler scope, default is `this`
	 * @return {Object} {@link Observable}
	 * @example
	 * observer.once( "click", function ( ev ) {
	 *   ...
	 * } );
	 */
	once (ev, handler, id = uuid(), scope = undefined) {
		scope = scope || this;

		return this.on(ev, (...args) => {
			handler.apply(scope, args);
			this.off(ev, id);
		}, id, scope);
	}

	/**
	 * Unhooks from `target` for a DOM event
	 *
	 * @method unhook
	 * @memberOf Observable
	 * @param  {Object} target Element
	 * @param  {String} ev     Event
	 * @return {Object}        Element
	 * @example
	 * observer.unhook( document.querySelector( "a" ), "click" );
	 */
	unhook (target, ev) {
		let obj = this.hooks.get(target);

		if (obj) {
			target.removeEventListener(ev, obj[ev], false);
			delete obj[ev];

			if (array.keys(obj).length === 0) {
				this.hooks.delete(target);
			}
			else {
				this.hooks.set(target, obj);
			}
		}

		return target;
	}
}

/**
 * Observable factory
 *
 * @method factory
 * @memberOf observable
 * @return {Object} {@link Observable}
 * @example
 * let observer = observable( 50 );
 */
const observable = function (arg) {
	return new Observable(arg);
};
