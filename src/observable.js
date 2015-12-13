class Observable {
	constructor (arg = 10) {
		this.limit = arg;
		this.listeners = {};
		this.hooks = new WeakMap();
	}

	dispatch (ev, ...args) {
		if (ev && has(this.listeners, ev)) {
			iterate(this.listeners[ev], function (i) {
				i.handler.apply(i.scope, args);
			});
		}

		return this;
	}

	hook (target, ev) {
		let obj;

		if (!has(target, addEventListener)) {
			throw new Error("Invalid Arguments");
		}

		obj = this.hooks.get(target) || {};

		if (!has(obj, ev)) {
			obj[ev] = arg => {
				this.dispatch(ev, arg);
			};
		}

		this.hooks.set(target, obj);
		target.addEventListener(ev, this.hooks.get(target)[ev], false);

		return target;
	}

	off (ev, id) {
		if (has(this.listeners, ev)) {
			if (id) {
				delete this.listeners[ev][id];
			} else {
				delete this.listeners[ev];
			}
		}

		return this;
	}

	on (ev, handler, id = uuid(), scope = undefined) {
		if (!has(this.listeners, ev)) {
			this.listeners[ev] = {};
		}

		if (Object.keys(this.listeners[ev]).length >= this.limit) {
			throw(new Error("Possible memory leak, more than " + this.limit + " listeners for event: " + ev));
		}

		this.listeners[ev][id] = {
			scope: scope || this,
			handler: handler
		};

		return this;
	}

	once (ev, handler, id = uuid(), scope = undefined) {
		scope = scope || this;

		return this.on(ev, (...args) => {
			handler.apply(scope, args);
			this.off(ev, id);
		}, id, scope);
	}

	unhook (target, ev) {
		let obj = this.hooks.get(target);

		if (obj) {
			target.removeEventListener(ev, obj[ev], false);
			delete obj[ev];

			if (Object.keys(obj).length === 0) {
				this.hooks.delete(target);
			} else {
				this.hooks.set(target, obj);
			}
		}

		return target;
	}
}

function factory (arg) {
	return new Observable(arg);
}
