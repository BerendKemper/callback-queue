"use strict";
/**@callback callback @param {function} next @param context*/
class CallbackQueue {
    #index = 0;
    #queue = [];
    #parent = null;
    constructor(parent) {
        if (typeof parent !== "undefined")
            this.#parent = parent;
    };
    #next() {
        if (++this.#index < this.#queue.length) {
            const { callback, context } = this.#queue[this.#index];
            this.#queue[this.#index] = null;
            return callback.call(this.#parent ?? this, () => this.#next(), context);
        }
        this.#index = 0;
        this.#queue = [];
    };
    /**@param {callback} callback*/
    push(callback, context) {
        if (this.#queue.length === 0) {
            this.#queue.length = 1;
            return callback.call(this.#parent ?? this, () => this.#next(), context);
        }
        this.#queue.push({ callback, context });
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