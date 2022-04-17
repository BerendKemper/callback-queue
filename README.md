# callback queue

<pre><code>npm i ca11back-queue</code></pre>

```javascript
const CallbackQueue = require("ca11back-queue");
```

<h2>Class: <code>CallbackQueue</code></h2>
The callbackQueue offers a synchronous execution of queued asynchronous functions (callbacks) and not blocking the eventloop. The callbackQueue can pass over arguments when pushing new callbacks into the queue. The callbackQueue can also pass over arguments when invoking the next queued callback. Additionally the callbackQueue can invoke queued callbacks and passing over a certain parent object as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">this</a>.
<h3><code>new CallbackQueue([parent])</code></h3>
<ul>
	<details>
		<summary>
			<code>parent</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a> optional
		</summary>
		Every callback is invoked with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call">call</a> and sets the either the <code>parent</code> parameter or in case that was undefined sets the callbackQueue as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">this</a>.
	</details>
</ul>
<h3><code>callbackQueue.push(callback[, ...args])</code></h3>
<ul>
	<details>
		<summary>
			<code>calback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
        <b><code>function callback(next[, ...args]) {}</code></b>
		<ul>
			<details>
				<summary>
					<code>next</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a> <b>Required!</b>
				</summary>
                <div><b><code>next([...args]);</code></b></div>
				Every <code>callback</code> must take a <code>next</code> as first parameter and this is a function. Invoking the <code>next</code> function from within the <code>callback</code> triggers the next callback in queue to be invoked. When passing arguments to the <code>next</code> function these arguments are added on top of the initial arguments that were passed over to the <code>push</code> method.
			</details>
			<details>
				<summary>
					<code>args</code>
				</summary>
				The combination of the initial captured arguments that were passed over to the <code>push</code> method and the secundaire captured arguments that were passed over into <code>next</code> function from the previous <code>callback</code> in the queue.
			</details>
		</ul>
		The asynchronous function to push into queue is the <code>callback</code> parameter.
	</details>
	<details>
		<summary>
			<code>args</code> optional
		</summary>
		These initial arguments are passed over over to the <code>callback</code>.
	</details>
    <details>
        <summary>
            Returns <code>this</code> &lt;CallbackQueue&gt;
        </summary>
        Allows chaining methods.
    </details>
</ul>
The first callback to be pushed is invoked immediately, more callbacks to be pushed are queued.
<h3><code>callbackQueue.clear()</code></h3>
<ul>
    <details>
        <summary>
            Returns <code>this</code> &lt;CallbackQueue&gt;
        </summary>
        Allows chaining methods.
    </details>
</ul>
Empties the inner queue, removing any queued callbacks and their arguments.
<h3><code>callbackQueue.destroy()</code></h3>
Empties the inner queue, removing any queued callbacks and their arguments and sets the parent property to null.
<h3><code>callbackQueue.index</code></h3>
<ul>
    <details>
        <summary>
            Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
        </summary>
        The index keeps increasing untill it reaches the end of the queue, then the index is set to 0.
    </details>
</ul>
Readable property of the current index in the queue.
<h3><code>callbackQueue.lastIndex</code></h3>
<ul>
    <details>
        <summary>
            Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">&lt;Boolean&gt;</a>
        </summary>
        The lastIndex is calculated as <code>index >= queue.length - 1</code>.
    </details>
</ul>
Readable property of the that states if the current index in the queue has hit the last index.
<h3><code>callbackQueue.length</code></h3>
<ul>
    <details>
        <summary>
            Returns <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
        </summary>
        The length keeps increasing the more callbacks are pushed into the queue untill the index reaches the end of the queue, then queue is cleared and it's lenght becomes 0.
    </details>
</ul>
Readable property of the length of the queue.
<h2>Example</h2>

```javascript
class MyModule {
    #c = 0;
    #queue;
    constructor() {
        this.#queue = new CallbackQueue(this);
    }
    a() {
        this.#queue.push(this.#afterTimeoutA, 1000);
        return this;
    }
    #afterTimeoutA(next, msec) {
        setTimeout(() => {
            this.#privMethod();
            next(console.log("finished a"));
        }, msec);
    }
    #privMethod() {
        console.log("counted priv:", ++this.#c);
    }
    b() {
        this.#queue.push(this.#aAfterTimeoutB, 500);
        return this;
    }
    #aAfterTimeoutB(next, msec) {
        setTimeout(() => next(console.log("finished b")), msec);
    }
    destroy() {
        this.#queue.destroy();
    }
}
const inst1 = new MyModule();
inst1.a().b().a().b().a().b()
    .b().b().b().a().a().a();
```

```javascript
// FilestreamLogger uses a CallbackQueue behind the screen.
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