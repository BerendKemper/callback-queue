"use strict";
class CallbackQueue {
	#index = 0;
	#queue = [];
	#next() {
		this.#queue[this.#index++] = null;
		if (this.#index < this.#queue.length) {
			const { callback, context } = this.#queue[this.#index];
			return callback.call(this.#parent || this, () => this.#next(), context);
		}
		this.clear();
	};
	#parent;
	constructor(parent) {
		this.#parent = typeof parent === "undefined" ? null : parent;
	};
	push(callback, context) {
		this.#queue.push({ callback, context });
		if (this.#index === this.#queue.length - 1)
			callback.call(this.#parent || this, () => this.#next(), context);
	};
	clear() {
		this.#index = 0;
		this.#queue = [];
	};
	destroy() {
		this.#parent = null;
		this.#index = 0;
		this.#queue = [];
	};
	get index() {
		return this.#index;
	};
	get length() {
		return this.#queue.length
	};
};
module.exports = CallbackQueue;