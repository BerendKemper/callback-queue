# callback queue

<pre><code>npm i ca11back-queue</code></pre>

```javascript
const CallbackQueue = require("ca11back-queue");
```

<h2>Class: <code>CallbackQueue</code></h2>
A <code>callbackQueue</code> can alter another module's flow of asynchronous methods to appear synchronous. Additionally, one instance from a module that has two or more references to it at different positions in the code, they share the same <code>callbackQueue</code>. Therefore if an asynchronous method is invoked on one reference of the instance and also invoked on another reference at the same time, the <code>callbackQueue</code> has queued each of those asynchronous methods. The execution of queued functions do not collide with eachother which can prevent (unexpected) bugs such as writing to a file when the previous write had not yet finished.
<h3><code>new CallbackQueue([parent])</code></h3>
<ul>
	<details>
		<summary>
			<code>parent</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a> optional
		</summary>
		Every <code>callback</code> is invoked with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call">call</a> and sets the <code>parent</code> parameter as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">this</a>. If <code>parent</code> is falsy the <code>callbackQueue</code> is set as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">this</a>. Only works if not-arrow functions are passed over as <code>callback</code> in <code>push</code>.
	</details>
</ul>
<h3><code>callbackQueue.push(callback[, context])</code></h3>
<ul>
	<details>
		<summary>
			<code>calback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
		<ul>
			<details>
				<summary>
					<code>next</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a> <b>Required!</b>
				</summary>
				The paramater <code>next</code> must be executed when the asynchronous tasks from the <code>callback</code> are finished or the <code>callbackQueue</code> gets stuck.
			</details>
			<details>
				<summary>
					<code>context</code>
				</summary>
				In case the <code>push</code> method was invoked with a <code>context</code> parameter, this parameter would be passed over as the second parameter in this <code>callback</code>.
			</details>
		</ul>
		The <code>callback</code> is the function, written by the developer who is using ca11back-queue, that needs to be queued.
	</details>
	<details>
		<summary>
			<code>context</code> optional
		</summary>
		Every <code>callback</code> is invoked with <code>context</code> passed over as second argument. The <code>context</code> parameter can be anything.
	</details>
</ul>
The first <code>callback</code> to be pushed is invoked immediately, more <code>callbacks</code> to be pushed are queued in a private queue array.
<h3><code>callbackQueue.clear()</code></h3>
Empties the private queue array, removing any queued <code>callbacks</code>.
<h3><code>callbackQueue.destroy()</code></h3>
Empties the private queue array, removing any queued <code>callbacks</code> and sets the private <code>parent</code> property to <code>null</code>.
<h3><code>callbackQueue.index</code></h3>
Readable property of the current index in the private <code>queue</code> array.
<h3><code>callbackQueue.length</code></h3>
Readable property of the length of the private <code>queue</code> array.
<h2>Example</h2>

```javascript
function nextAfterTimeoutA(next, { msec, privMethod } = context) {
	setTimeout(() => {
		privMethod.call(this);
		next(console.log("finished a"));
	}, msec);
};
function nextAfterTimeoutB(next, msec) {
	setTimeout(() => next(console.log("finished b")), msec);
};
class MyModule {
	#queue;
	constructor() {
		this.#queue = new CallbackQueue(this);
	};
	#c = 0;
	#privMethod() {
		console.log("counted priv:", ++this.#c);
	};
	a() {
		this.#queue.push(nextAfterTimeoutA, { msec: 1000, privMethod: this.#privMethod });
		return this;
	};
	b() {
		this.#queue.push(nextAfterTimeoutB, 500);
		return this;
	};
	destroy() {
		this.queue.destroy();
	};
};
const inst1 = new MyModule();
const inst2 = inst1;
inst1.a().b().a().b().a().b();
inst2.b().b().b().a().a().a();
```

```javascript
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