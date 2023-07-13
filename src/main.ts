export default class TimedCache<D> {
	private cache: Record<string, [D, NodeJS.Timeout, number]> = {};

	// 300_000 = 1000 * 60 * 5 (= 5 minutes)
	constructor(public readonly cacheTimeoutLength = 300_000) {}

	get keys() {
		return Object.keys(this.cache);
	}

	set(key: string, value: D, timeout?: number) {
		if (this.has(key)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [_, id] = this.cache[key];
			clearTimeout(id);
		}

		const timeoutLength = timeout || this.cacheTimeoutLength;

		this.cache[key] = [
			value,
			setTimeout(() => {
				if (this.has(key)) {
					delete this.cache[key];
				}
			}, timeoutLength),
			new Date().getTime() + timeoutLength,
		];
	}

	get(key: string): D | null {
		if (!this.has(key)) {
			return null;
		}

		const [value] = this.cache[key];
		return value;
	}

	forEach(action: (item: D) => void) {
		for (const key of this.keys) {
			const value = this.get(key);
			if (!value) continue;
			action(value);
		}
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

	remaining(key: string) {
		const entry = this.cache[key];
		if (!entry) {
			return null;
		}

		const [_v, _t, end] = entry;
		const now = new Date().getTime();

		return Math.max(0, end - now);
	}
}
