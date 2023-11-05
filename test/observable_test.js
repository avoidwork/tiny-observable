import assert from "node:assert";
import {observable, Observable} from "../dist/tiny-observable.cjs";

const mockElement = {
	id: 'mockElement',
	addEventListener: () => void 0,
	removeEventListener: () => void 0
}

const testEvent = 'test';

describe("Observable", function () {
	it("Will create a new observable", function () {
		const instance = observable();
		assert.strictEqual(instance instanceof Observable, true, "Should be an instance of Observable");
		assert.strictEqual(instance.listenerCount(testEvent), 0, "Should be `0`");
	});

	it("Will reassign limit with setMaxListeners()", function () {
		const instance = observable();
		assert.strictEqual(instance.limit, observable().limit, "Should be the default");
		instance.setMaxListeners(instance.limit - 1);
		assert.strictEqual(instance.limit < observable().limit, true, "Should be less than the default");
	});

	it("Will dispatch events when empty", function () {
		const instance = observable();
		assert.strictEqual(instance.dispatch(testEvent), instance, "Should be `instance`");
		assert.strictEqual(instance.listenerCount(testEvent), 0, "Should be `0`");
	});

	it("Will hook inputs", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.hook(mockElement, testEvent), instance, "Should be `instance`");
	});

	it("Will dispatch events", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.dispatch(testEvent), instance, "Should be `instance`");
	});

	it("Will unhook inputs", function () {
		const instance = observable();
		instance.hook(mockElement, testEvent);
		assert.strictEqual(instance.unhook(mockElement, testEvent), instance, "Should be `instance`");
	});
});
