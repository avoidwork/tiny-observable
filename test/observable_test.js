import assert from "node:assert";
import {observable, Observable} from "../dist/tiny-observable.cjs";

describe("Observable", function () {
	it("Will create a new observable", function () {
		const instance = observable();
		assert.strictEqual(instance instanceof Observable, true, "Should be an instance of Observable");
	});
});
