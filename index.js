"use strict";
class CallbackQueue {
    #index = 0;
    #queue = [];
    #nextCb = null;
    #initArgs = null;
    constructor(...initArgs) {
        this.#initArgs = initArgs;
        this.#nextCb = (...args2) => this.#next(args2);
    }
    #next(args2) {
        if (++this.#index < this.#queue.length) {
            const [callback, ...args] = this.#queue[this.#index];
            this.#queue[this.#index] = null;
            return callback(...this.#initArgs, this.#nextCb, ...args, ...args2);
        }
        this.clear();
    }
    /**@param {() => void} callback*/
    push(callback, ...args) {
        if (this.#queue.length === 0) {
            this.#queue.length = 1;
            callback(...this.#initArgs, this.#nextCb, ...args);
            return this;
        }
        this.#queue.push(arguments);
        return this;
    }
    clear() {
        this.#queue.length = this.#index = 0;
        return this;
    }
    destroy() {
        this.clear().#initArgs = this.#nextCb = this.#queue = null;
    }
    get index() {
        return this.#index;
    }
    get lastIndex() {
        return this.#index >= this.#queue.length - 1;
    }
    get length() {
        return this.#queue.length;
    }
}
module.exports = CallbackQueue;