	class Observable {
		constructor (arg = 10) {
			this.limit = arg;
			this.listeners = {};
			this.hooks = new WeakMap();
		}

		dispatch (ev, ...args) {
			if (ev && has(this.listeners, ev)) {
				iterate(this.listeners[ev], i => {
					let obj = this.listeners[ev][i];

					obj.handler.apply(obj.scope, args);
				});
			}

			return this;
		}

		hook (target, ev) {
			let ltarget = array(target);

			ltarget.forEach(t => {
				let obj;

				if (!has(t, "addEventListener")) {
					throw new Error("Invalid Arguments");
				}

				obj = this.hooks.get(t) || {};

				if (!has(obj, ev)) {
					obj[ev] = arg => {
						this.dispatch(ev, arg);
					};
				}

				this.hooks.set(t, obj);
				t.addEventListener(ev, this.hooks.get(t)[ev], false);
			});

			return this;
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
				throw new Error("Possible memory leak, more than " + this.limit + " listeners for event: " + ev);
			}

			this.listeners[ev][id] = {
				scope: scope || this,
				handler: handler
			};

			return this;
		}

		once (ev, handler, id = uuid(), scope = undefined) {
			let lscope = scope || this;

			return this.on(ev, (...args) => {
				handler.apply(lscope, args);
				this.off(ev, id);
			}, id, lscope);
		}

		unhook (target, ev) {
			let ltarget = array(target);

			ltarget.forEach(t => {
				let obj;

				if (!has(t, "removeEventListener")) {
					throw new Error("Invalid Arguments");
				}

				obj = this.hooks.get(t);

				if (obj) {
					t.removeEventListener(ev, obj[ev], false);
					delete obj[ev];

					if (Object.keys(obj).length === 0) {
						this.hooks.delete(t);
					} else {
						this.hooks.set(t, obj);
					}
				}
			});

			return this;
		}
	}

	function factory (arg) {
		return new Observable(arg);
	}
