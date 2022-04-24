# callback queue

<pre><code>npm i ca11back-queue</code></pre>

```javascript
const CallbackQueue = require("ca11back-queue");
```

<div>
    <h2>Class: <code>CallbackQueue</code></h2>
    <div>
        The callbackQueue offers a synchronous execution of queued asynchronous functions (callbacks) and not blocking the eventloop. When pushing callbacks into the queue arguments can be passed over. Arguments can also be passed over when invoking the next function from within a queued callback. The <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">this</a> from wihin a callback are the callbackQueue itself so that also count for classes that are extended from the CallbackQueue. During the construction of a callbackQueue certain defaultArgs can be set.
    </div>
</div>

<div>
    <h3><code>new CallbackQueue([...initArgs])</code></h3>
    <ul>
        <details>
            <summary>
                <code>initArgs</code> optional
            </summary>
            <div>
                When initArgs are initialized they are set the become the first arguments of every callback located even before the next function argument.
            </div>
        </details>
    </ul>
</div>

<div>
    <h3><code>callbackQueue.push(callback[, ...args])</code></h3>
    <ul>
        <details>
            <summary>
                <code>calback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
            </summary>
            <b><code>function callback([...initArgs, ]next[, ...args]) {}</code></b>
            <ul>
                <details>
                    <summary>
                        <code>initArgs</code>
                    </summary>
                    <div>
                        When initArgs were initialized they are the first arguments in every callback.
                    </div>
                </details>
                <details>
                    <summary>
                        <code>next</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a> <b>Required!</b>
                    </summary>
                    <div><b><code>next([...args]);</code></b></div>
                    <div>
                        Every callback must take a next as first parameter and this is a function. Invoking the next function from within the callback triggers the next callback in queue to be invoked. When passing arguments to the next function these arguments are added on top of the initial arguments that were passed over to the push method.
                    </div>
                </details>
                <details>
                    <summary>
                        <code>args</code> optional
                    </summary>
                    <div>
                        A combination captured arguments:<br>
                        1. arguments captured when invoking the the push method<br>
                        2. arguments captured when invoking the next function from the previous callback in the queue.
                    </div>
                </details>
            </ul>
            <div>
                The asynchronous function to push into queue is the callback parameter.
            </div>
        </details>
        <details>
            <summary>
                <code>args</code> optional
            </summary>
            <div>
                Arguments passed over when invoking the push methods are set to be the first arguments after the next function argument within the queued callback.
            </div>
        </details>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-callbackqueue">&lt;CallbackQueue&gt;</a>
            </summary>
            For chaining methods.
        </details>
    </ul>
    <div>
        The first callback to be pushed is invoked immediately, more callbacks to be pushed are queued.
    </div>
</div>

<div>
    <h3><code>callbackQueue.clear()</code></h3>
    <ul>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-callbackqueue">&lt;CallbackQueue&gt;</a>
            </summary>
            Allows chaining methods.
        </details>
    </ul>
    <div>
        Empties the queue, removing any queued callbacks and their arguments and sets the index to <code>0</code>.
    </div>
</div>

<div>
    <h3><code>callbackQueue.destroy()</code></h3>
    Empties the queue, removing any queued callbacks and their arguments and removes any references to functios and arguments. Make sure to remove all references to the instance so it can be garbage collected.
</div>

<div>
    <h3><code>callbackQueue.index</code></h3>
    <ul>
        <details>
            <summary>
                Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
            </summary>
            <div>
                The index keeps increasing untill it reaches the end of the queue, then the index is set to <code>0</code>.
            </div>
        </details>
    </ul>
    <div>
        Readable property of the current index in the queue.
    </div>
</div>

<div>
    <h3><code>callbackQueue.lastIndex</code></h3>
    <ul>
        <details>
            <summary>
                Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">&lt;Boolean&gt;</a>
            </summary>
            <div>
                The lastIndex is calculated as <code>index >= queue.length - 1</code>.
            </div>
        </details>
    </ul>
    <div>
        Readable property that returns the state if the current index in the queue has reached the end of the queue.
    </div>
</div>

<div>
    <h3><code>callbackQueue.length</code></h3>
    <ul>
        <details>
            <summary>
                Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
            </summary>
            <code>
                The length keeps increasing the more callbacks are pushed into the queue untill the index reaches the end of the queue, then queue is cleared and it's lenght becomes 0.
            </code>
        </details>
    </ul>
    <div>
        Readable property of the length of the queue.
    </div>
</div>
<h2>Example</h2>

```javascript
class MyModule extends CallbackQueue {
    #c = 0;
    a() {
        this.push(this.#afterTimeoutA, 1000);
        return this;
    }
    #afterTimeoutA(initArg, next, msec) {
        setTimeout(() => {
            this.#privMethod();
            next(console.log("finished a"));
        }, msec);
    }
    #privMethod() {
        console.log("counted priv:", ++this.#c);
    }
    b() {
        this.push(this.#aAfterTimeoutB, 500);
        return this;
    }
    #aAfterTimeoutB(initArg, next, msec) {
        setTimeout(() => next(console.log("finished b")), msec);
    }
}
const inst1 = new MyModule({ "i am always the first argument": true });
inst1.a().b().a().b().a().b()
    .b().b().b().a().a().a()
    .push(function (initArg) {
        console.log(initArg);
        this.destroy();
    });
```

```javascript
// FilestreamLogger uses a CallbackQueue under the hood.
const FilestreamLogger = require("filestream-logger");
const logger = {};
logger.log = new FilestreamLogger("log");
logger.log("this module uses ca11back-queue");
logger.log("to alter asynchronous flow");
logger.log("to appear synchronous");
logger.error = new FilestreamLogger("error", { extend: [logger.log] });
loger.error("and also used ca11back-queue");
loger.error("to ensure that multiple references");
loger.log("to the same instance");
loger.error("invoking their asynchronous methods");
logger.log("... suddenly gets destroyed");
logger.log.destroy();
// the next is queued in logger.log but the queue is also cleared
loger.error("do not collide with eachother");
```