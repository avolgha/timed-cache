export default class TimedCache<D> {
	private cache: Record<string, [D, NodeJS.Timeout]> = {};

	// 300_000 = 1000 * 60 * 5 (= 5 minutes)
	constructor(public readonly cacheTimeoutLength = 300_000) {}

	set(key: string, value: D) {
		if (this.has(key)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [_, id] = this.cache[key];
			clearTimeout(id);
		}

		this.cache[key] = [
			value,
			setTimeout(() => {
				if (this.has(key)) {
					delete this.cache[key];
				}
			}, this.cacheTimeoutLength),
		];
	}

	get(key: string): D | null {
		if (!this.has(key)) {
			return null;
		}

		const [value] = this.cache[key];
		return value;
	}

	remove(key: string): D | null {
		const value = this.get(key);
		if (value === null) {
			return null;
		}

		delete this.cache[key];
		return value;
	}

	has(key: string): boolean {
		return this.cache[key] !== undefined;
	}
}
