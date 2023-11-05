/**
 * tiny-observable
 *
 * @copyright 2023 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 2.0.0
 */
const EMPTY = "";
const HANDLER = () => void 0;
const ID = () => `ob-${Math.random().toString(36).slice(2, 9)}`;
const INVALID_ARGUMENTS = "Invalid arguments";
const POSSIBLE_MEMORY_LEAK = "`Possible memory leak, more than {{LIMIT}} listeners for event: {{EVENT}}";
const TOKEN_EVENT = "{{EVENT}}";
const TOKEN_LIMIT = "{{LIMIT}}";class Observable {
	constructor (arg = 10, id = crypto?.randomUUID ?? ID) {
		this.id = id;
		this.limit = arg;
		this.listeners = new Map();
		this.hooks = new WeakMap();
	}

	dispatch (ev = EMPTY, ...args) {
		if (ev.length === 0) {
			throw new TypeError(INVALID_ARGUMENTS);
		}

		this.listeners.get(ev)?.forEach(obj => obj.handler.apply(obj.scope, args));

		return this;
	}

	hook (target = null, ev = EMPTY) {
		if (target === null || ev.length === 0) {
			throw new TypeError(INVALID_ARGUMENTS);
		}

		for (const obj of Array.isArray(target) ? target : [target]) {
			if (this.hooks.has(obj) === false) {
				this.hooks.set(obj, new Map());
			}

			if (this.hooks.get(obj).has(ev) === false) {
				this.hooks.get(obj).set(ev, arg => this.dispatch(ev, arg));
			}

			obj?.addEventListener(ev, this.hooks.get(obj).get(ev), false);
		}

		return this;
	}

	off (ev = EMPTY, id = EMPTY) {
		if (ev.length === 0) {
			throw new TypeError(INVALID_ARGUMENTS);
		}

		if (id.length === 0) {
			this.listeners.get(ev)?.clear();
		} else if (id.length > 0) {
			this.listeners.get(ev)?.delete(id);
		}

		return this;
	}

	on (ev = EMPTY, handler = HANDLER, id = this.id(), scope = this) {
		if (this.listeners.has(ev) === false) {
			this.listeners.set(ev, new Map());
		}

		if (this.listeners.get(ev).size >= this.limit) {
			throw new Error(POSSIBLE_MEMORY_LEAK.replace(TOKEN_EVENT, ev).replace(TOKEN_LIMIT, this.limit));
		}

		this.listeners.get(ev).set(id, {scope, handler});

		return this;
	}

	once (ev = "", handler = HANDLER, id = this.id(), scope = this) {
		return this.on(ev, (...args) => {
			handler.apply(scope, args);
			this.off(ev, id);
		}, id, scope);
	}

	setMaxListeners (arg = 10) {
		if (isNaN(arg)) {
			throw new TypeError(INVALID_ARGUMENTS);
		}

		this.limit = arg;

		return this;
	}

	unhook (target = null, ev = EMPTY) {
		if (target === null) {
			throw new TypeError(INVALID_ARGUMENTS);
		}

		for (const arg of Array.isArray(target) ? target : [target]) {
			if (this.hooks.has(arg)) {
				if (ev.length > 0 && this.hooks.get(arg).has(ev)) {
					arg?.removeEventListener(ev, this.hooks.get(arg).get(ev), false);
					this.hooks.get(arg)?.delete(ev);
				} else {
					this.hooks.get(arg).forEach((v, k) => arg?.removeEventListener(k, v, false));
					this.hooks.delete(arg);
				}
			}
		}

		return this;
	}
}

function observable (arg = 10, id = crypto?.randomUUID ?? ID) {
	return new Observable(arg, id);
}export{Observable,observable};