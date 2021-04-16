# callback queue

<pre><code>npm i ca11back-queue</code></pre>

```javascript
const CallbackQueue = require("ca11back-queue");
```

<h2>Class: <code>CallbackQueue</code></h2>
A <code>callbackQueue<code> can alter another module's flow of asynchronous methods to appear synchronous. Additionally, one instance from a module that has two or more references to it at different positions in the code, they share the same <code>callbackQueue<code>. Therefore if an asynchronous method is invoked on one reference of the instance and also invoked on another reference at the same time, the <code>callbackQueue</code> has queued each of those asynchronous methods. The execution of queued functions do not collide with eachother which can prevent (unexpected) bugs such as writing to a file when the previous write had not yet finished. 
<h3><code>new CallbackQueue()</code></h3>
<h3><code>callbackQueue.push(callback)</code></h3>
<ul>
	<details>
		<summary>
			<code>calback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
		<ul>
			<details>
				<summary>
					<code>next</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
				</summary>
				The paramater <code>next</code> must be executed when the asynchronous tasks from the <code>callback</code> are finished or the <code>callbackQueue</code> gets stuck. 
			</details>
		</ul>
		The <code>callback</code> is the function, written by the developer who is using ca11back-queue, that needs to be queued.
	</details>
</ul>
The first <code>callback</code> to be pushed is invoked immediately, more <code>callbacks</code> to be pushed are queued in a private queue array.
<h3><code>callbackQueue.clear()</code></h3>
Empties the private queue array, removing any queued <code>callbacks</code>.
<h2>Example</h2>

```javascript
class MyModule {
	#queue = new CallbackQueue();
	a() {
		this.#queue.push(next => setTimeout(() => next(console.log("finished a")), 1000));
		return this;
	};
	b() {
		this.#queue.push(next => setTimeout(() => next(console.log("finished b")), 500));
		return this;
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
logger.log("... suddenly walks away");
logger.log.destroy();
// the next is queued in logger.log but the queue is also cleared
loger.error("do not collide with eachother"); 
```