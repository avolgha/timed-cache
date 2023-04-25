const TimedCache = require("./dist/timed-cache.cjs");

function sleep(length) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, length);
	});
}

(async () => {
	const cache = new TimedCache(5000);

	cache.set("foo", "bar");
	console.log(cache.get("foo"));

	await sleep(1000 * 3);

	console.log(cache.get("foo"));

	await sleep(1000 * 3);

	console.log(cache.get("foo"));

	await sleep(1000 * 3);

	console.log(cache.get("foo"));
})();
