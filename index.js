"use strict";
class CallbackQueue {
    #index = 0;
    #queue = [];
    #parent = null;
    #nextCb = null;
    constructor(parent) {
        this.#parent = typeof parent === "undefined" ? this : parent;
        this.#nextCb = arg => this.#next(arg);
    }
    #next(arg) {
        if (++this.#index < this.#queue.length) {
            const { callback, context } = this.#queue[this.#index];
            this.#queue[this.#index] = null;
            return callback.call(this.#parent, this.#nextCb, context, arg);
        }
        this.#index = 0;
        this.#queue = [];
    }
    /**@param {callback} callback*/
    push(callback, context) {
        if (this.#queue.length === 0) {
            this.#queue.length = 1;
            callback.call(this.#parent, this.#nextCb, context);
            return this;
        }
        this.#queue.push({ callback, context });
        return this;
    }
    clear() {
        this.#index = 0;
        this.#queue = [];
        return this;
    }
    destroy() {
        this.#parent = null;
        this.#nextCb = null;
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
/**@callback callback @param {function} next @param context*/