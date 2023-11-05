import assert from "node:assert";
import {observable, Observable} from "../dist/tiny-observable.cjs";

const mockElement = {
	id: "mockElement",
	handlers: {},
	addEventListener: (id, fn) => {
		mockElement.handlers[id] ||= new Set();
		mockElement.handlers[id].add(fn);
	},
	removeEventListener: (id, fn) => {
		mockElement.handlers[id] ||= new Set();
		mockElement.handlers[id].delete(fn);
	}
};
const testEvent = "test";
const testHandler = () => void 0;

describe("Observable", function () {
	it("Will create a new observable", function () {
		const instance = observable();
		assert.strictEqual(instance instanceof Observable, true, "Should be an instance of Observable");
		assert.strictEqual(instance.listenerCount(testEvent), 0, "Should be `0`");
	});

	it("Will reassign limit with setMaxListeners()", function () {
		const instance = observable();
		assert.strictEqual(instance.getMaxListeners(), observable().getMaxListeners(), "Should be the default");
		instance.setMaxListeners(instance.getMaxListeners() - 1);
		assert.strictEqual(instance.getMaxListeners() < observable().getMaxListeners(), true, "Should be less than the default");
	});

	it("Will dispatch events when empty", function () {
		const instance = observable();
		assert.strictEqual(instance.dispatch(testEvent), instance, "Should be 'instance'");
		assert.strictEqual(instance.emit(testEvent), instance, "Should be 'instance'");
		assert.strictEqual(instance.listenerCount(testEvent), 0, "Should be `0`");
	});

	it("Will hook element dispatch of event", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.hook(mockElement, testEvent), instance, "Should be 'instance'");
	});

	it("Will dispatch event", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.dispatch(testEvent), instance, "Should be 'instance'");
	});

	it("Will unhook element dispatch of event", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.unhook(mockElement, testEvent), instance, "Should be 'instance'");
	});

	it("Will add & remove event handlers to a hooked input", function () {
		const instance = observable();
		assert.strictEqual(instance.hook(mockElement, testEvent), instance, "Should be 'instance'");
		assert.strictEqual(instance.on(testEvent, testHandler, "abc"), instance, "Should be 'instance'");
		assert.strictEqual(instance.once(testEvent, testHandler, "abc-once"), instance, "Should be 'instance'");
		assert.strictEqual(instance.addListener(testEvent, testHandler), instance, "Should be 'instance'");
		assert.strictEqual(instance.eventNames().length, 1, "Should be '1'");
		assert.strictEqual(instance.rawListeners(testEvent).length, 3, "Should be '3'");
		assert.strictEqual(instance.removeListener(testEvent, "abc"), instance, "Should be 'instance'");
		assert.strictEqual(instance.rawListeners(testEvent).length, 2, "Should be '2'");
		assert.strictEqual(instance.removeAllListeners(testEvent), instance, "Should be 'instance'");
		assert.strictEqual(instance.rawListeners(testEvent).length, 0, "Should be '0'");
		assert.strictEqual(instance.unhook(mockElement), instance, "Should be 'instance'");
	});

	it("Will throw errors with bad inputs", function () {
		const instance = observable(1);
		assert.throws(() => instance.hook(mockElement), TypeError);
		assert.throws(() => instance.unhook(), TypeError);
		assert.throws(() => instance.dispatch(), TypeError);
		assert.throws(() => instance.listenerCount(), TypeError);
		assert.throws(() => instance.off(), TypeError);
		assert.throws(() => instance.on(), TypeError);
		assert.throws(() => {
			instance.on(testEvent, testHandler);
			instance.on(testEvent, testHandler);
		}, Error);
		assert.throws(() => instance.rawListeners(), TypeError);
		assert.throws(() => instance.setMaxListeners("a"), TypeError);
	});
});
