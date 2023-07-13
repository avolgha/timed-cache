<p><h2 align="center">timed-cache</h2></p>
<p align="center">Store values for a limited time in a kind of map.</p>

## Usage

````typescript
import TimedCache from "@avolgha/timed-cache";

const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

(async () => {
	const cache = new TimedCache(1000 * 3);

	cache.set("foo", "bar");

	console.log(cache.get("foo"));
	// => "bar"

	await sleep(1000 * 2);

	console.log(cache.get("foo"));
	// => "bar";

	await sleep(1000 * 2);

	console.log(cache.get("foo"));
	// => null
})();
````

## Todos

##### done in v1.0.1
- [x] Create a way to access stored keys.
- [x] Give the developer access to the remaining time of an item.
- [x] Create a `forEach` function.
- [x] Let developer optionally choose a time for the items removal.

## Configuration

You can crate a cache by instantiating the default export of the `@avolgha/timed-cache` package.  
Optionally, you can specify the time after that an item of the map should be deleted. *This time has
to be specified in milliseconds.*

````typescript
const cache = new TimedCache();
// => items will be deleted after 5 minutes

const cache = new TimedCache(1000 * 3);
// => items will be deleted after 3 seconds
````

A cache can only contain one type of item. You can specify this type with a generic on the `TimedCache`
class:

````typescript
const stringCache = new TimedCache<string>();
````

If you don't specify any generic, TypeScript will refer to `any` as the default type.

## Methods

To add items to the map, you can use the `set` method. It requires two arguments, a key and a value.

````typescript
const key: string = "foo";
const value: string = "bar";

cache.set(key, value);

// you can also specify a custom time for each item:
cache.set(key, value, 1000);
````

If you then want to get a specific item from the cache, you can use the `get` method. This method
only requires the key of the item you want to get.

````typescript
const key = "foo";
const value = cache.get(key);
````

Like `get` you can also iterate over every item in the cache.

````typescript
cache.forEach((value) => {
	// noop
});
````

If you want to get all the stored keys in the cache, you have to access them through the `keys`
property.

````typescript
const keys = cache.keys;
````

If you then not longer need the value, you can remove it with the `remove` function. This function
aswell only needs the key of the item. And additionally, it returns the item you removed.

````typescript
const key = "foo";
const removed = cache.remove(key);
````

To check if there is an item with a given key, you can check this with the help of the `has`
function. It only requires the key of the item you want to check for existance.

````typescript
const key = "foo";
if (cache.has(key)) {
	console.log(`"${cache.get(key)}" is in the cache!`);
}
````

If you want to see the remaining time of the entry in the cache, you can use the `remaining` function.

````typescript
const key = "foo";

const timeRemaining = cache.remaining(key);
````
