"use strict";
class QueueCallback {
	#index = 0;
	#queue = [];
	#next() {
		if (++this.#index < this.#queue.length)
			return this.#queue[this.#index](() => this.#next());
		this.clear();
	};
	push(callback) {
		this.#queue.push(callback);
		if (this.#index === this.#queue.length - 1)
			callback(() => this.#next());
	};
	clear() {
		this.#index = 0;
		this.#queue = [];
	};
};
module.exports = QueueCallback;