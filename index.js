"use strict";
class CallbackQueue {
    #index = 0;
    #queue = [];
    #parent = null;
    #nextCb = null;
    constructor(parent) {
        this.#parent = typeof parent === "undefined" ? this : parent;
        this.#nextCb = (...args) => this.#next(args);
    }
    #next(args2) {
        if (++this.#index < this.#queue.length) {
            const [callback, ...args] = this.#queue[this.#index];
            this.#queue[this.#index] = null;
            return callback.call(this.#parent, this.#nextCb, ...args, ...args2);
        }
        this.#index = 0;
        this.#queue = [];
    }
    /**@param {import("ca11back-queue/callback").callback} callback*/
    push(callback, ...args) {
        if (this.#queue.length === 0) {
            this.#queue.length = 1;
            callback.call(this.#parent, this.#nextCb, ...args);
            return this;
        }
        this.#queue.push(arguments);
        return this;
    }
    clear() {
        this.#index = 0;
        this.#queue.length = 0;
        return this;
    }
    destroy() {
        this.#parent = null;
        this.#nextCb = null;
        this.#queue.length = 0;
        this.#queue = null;
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