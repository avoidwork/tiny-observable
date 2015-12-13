const WeakMap = global.WeakMap || require("es6-weak-map");
const r = [8, 9, "a", "b"];

function has (obj, prop) {
	return obj[prop] !== undefined;
}

function array (obj) {
	return obj instanceof Array ? obj : has(obj, "length") ? Array.from(obj) : [obj];
}

function iterate (obj, fn, ctx = obj) {
	Object.keys(obj).forEach((i, idx) => {
		fn.call(ctx, i, idx);
	});
}

function s () {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function uuid () {
	return s() + s() + "-" + s() + "-4" + s().substr(0, 3) + "-" + r[Math.floor(Math.random() * 4)] + s().substr(0, 3) + "-" + s() + s() + s();
}
