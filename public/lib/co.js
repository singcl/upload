(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// var run = require('./src/run');\r\n// var wrap = require('./src/wrap');\r\nvar thunkify = __webpack_require__(/*! ./src/thunkify */ \"./src/thunkify.js\");\r\nvar promisify = __webpack_require__(/*! ./src/promisify */ \"./src/promisify.js\");\r\n// var co = require('./src/co');\r\n\r\nvar cov4 = __webpack_require__(/*! ./src/co-4.x */ \"./src/co-4.x.js\");\r\n\r\n// exports = module.exports = co;\r\nexports = module.exports = cov4;\r\n\r\nexports.thunkify = thunkify;\r\nexports.promisify = promisify;\r\n// exports.run = run;\r\n// exports.wrap = wrap;\r\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/co-4.x.js":
/*!***********************!*\
  !*** ./src/co-4.x.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * slice() reference.\r\n */\r\n\r\nvar slice = Array.prototype.slice;\r\n\r\n/**\r\n * Expose `co`.\r\n */\r\n\r\nmodule.exports = co['default'] = co.co = co;\r\n\r\n/**\r\n * Wrap the given generator `fn` into a\r\n * function that returns a promise.\r\n * This is a separate function so that\r\n * every `co()` call doesn't create a new,\r\n * unnecessary closure.\r\n *\r\n * @param {GeneratorFunction} fn\r\n * @return {Function}\r\n * @api public\r\n */\r\n\r\nco.wrap = function (fn) {\r\n    createPromise.__generatorFunction__ = fn;\r\n    return createPromise;\r\n\r\n    function createPromise() {\r\n        return co.call(this, fn.apply(this, arguments));\r\n    }\r\n};\r\n\r\n/**\r\n * Execute the generator function or a generator\r\n * and return a promise.\r\n *\r\n * @param {Function} fn\r\n * @return {Promise}\r\n * @api public\r\n */\r\n\r\nfunction co(gen) {\r\n    var ctx = this;\r\n    var args = slice.call(arguments, 1);\r\n\r\n    // we wrap everything in a promise to avoid promise chaining,\r\n    // which leads to memory leak errors.\r\n    // see https://github.com/tj/co/issues/180\r\n    return new Promise(function (resolve, reject) {\r\n        if (typeof gen === 'function') gen = gen.apply(ctx, args);\r\n        if (!gen || typeof gen.next !== 'function') return resolve(gen);\r\n\r\n        onFulfilled();\r\n\r\n        /**\r\n         * @param {Mixed} res\r\n         * @return {Promise}\r\n         * @api private\r\n         */\r\n\r\n        function onFulfilled(res) {\r\n            var ret;\r\n            try {\r\n                ret = gen.next(res);\r\n            } catch (e) {\r\n                return reject(e);\r\n            }\r\n            next(ret);\r\n        }\r\n\r\n        /**\r\n         * @param {Error} err\r\n         * @return {Promise}\r\n         * @api private\r\n         */\r\n\r\n        function onRejected(err) {\r\n            var ret;\r\n            try {\r\n                ret = gen.throw(err);\r\n            } catch (e) {\r\n                return reject(e);\r\n            }\r\n            next(ret);\r\n        }\r\n\r\n        /**\r\n         * Get the next value in the generator,\r\n         * return a promise.\r\n         *\r\n         * @param {Object} ret\r\n         * @return {Promise}\r\n         * @api private\r\n         */\r\n\r\n        function next(ret) {\r\n            if (ret.done) return resolve(ret.value);\r\n            var value = toPromise.call(ctx, ret.value);\r\n            if (value && isPromise(value)) return value.then(onFulfilled, onRejected);\r\n            return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' +\r\n                'but the following object was passed: \"' + String(ret.value) + '\"'));\r\n        }\r\n    });\r\n}\r\n\r\n/**\r\n * Convert a `yield`ed value into a promise.\r\n *\r\n * @param {Mixed} obj\r\n * @return {Promise}\r\n * @api private\r\n */\r\n\r\nfunction toPromise(obj) {\r\n    if (!obj) return obj;\r\n    if (isPromise(obj)) return obj;\r\n    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);\r\n    if ('function' == typeof obj) return thunkToPromise.call(this, obj);\r\n    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);\r\n    if (isObject(obj)) return objectToPromise.call(this, obj);\r\n    return obj;\r\n}\r\n\r\n/**\r\n * Convert a thunk to a promise.\r\n *\r\n * @param {Function}\r\n * @return {Promise}\r\n * @api private\r\n */\r\n\r\nfunction thunkToPromise(fn) {\r\n    var ctx = this;\r\n    return new Promise(function (resolve, reject) {\r\n        fn.call(ctx, function (err, res) {\r\n            if (err) return reject(err);\r\n            if (arguments.length > 2) res = slice.call(arguments, 1);\r\n            resolve(res);\r\n        });\r\n    });\r\n}\r\n\r\n/**\r\n * Convert an array of \"yieldables\" to a promise.\r\n * Uses `Promise.all()` internally.\r\n *\r\n * @param {Array} obj\r\n * @return {Promise}\r\n * @api private\r\n */\r\n\r\nfunction arrayToPromise(obj) {\r\n    return Promise.all(obj.map(toPromise, this));\r\n}\r\n\r\n/**\r\n * Convert an object of \"yieldables\" to a promise.\r\n * Uses `Promise.all()` internally.\r\n *\r\n * @param {Object} obj\r\n * @return {Promise}\r\n * @api private\r\n */\r\n\r\nfunction objectToPromise(obj) {\r\n    var results = new obj.constructor();\r\n    var keys = Object.keys(obj);\r\n    var promises = [];\r\n    for (var i = 0; i < keys.length; i++) {\r\n        var key = keys[i];\r\n        var promise = toPromise.call(this, obj[key]);\r\n        if (promise && isPromise(promise)) defer(promise, key);\r\n        else results[key] = obj[key];\r\n    }\r\n    return Promise.all(promises).then(function () {\r\n        return results;\r\n    });\r\n\r\n    function defer(promise, key) {\r\n        // predefine the key in the result\r\n        results[key] = undefined;\r\n        promises.push(promise.then(function (res) {\r\n            results[key] = res;\r\n        }));\r\n    }\r\n}\r\n\r\n/**\r\n * Check if `obj` is a promise.\r\n *\r\n * @param {Object} obj\r\n * @return {Boolean}\r\n * @api private\r\n */\r\n\r\nfunction isPromise(obj) {\r\n    return 'function' == typeof obj.then;\r\n}\r\n\r\n/**\r\n * Check if `obj` is a generator.\r\n *\r\n * @param {Mixed} obj\r\n * @return {Boolean}\r\n * @api private\r\n */\r\n\r\nfunction isGenerator(obj) {\r\n    return 'function' == typeof obj.next && 'function' == typeof obj.throw;\r\n}\r\n\r\n/**\r\n * Check if `obj` is a generator function.\r\n *\r\n * @param {Mixed} obj\r\n * @return {Boolean}\r\n * @api private\r\n */\r\nfunction isGeneratorFunction(obj) {\r\n    var constructor = obj.constructor;\r\n    if (!constructor) return false;\r\n    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;\r\n    return isGenerator(constructor.prototype);\r\n}\r\n\r\n/**\r\n * Check for plain object.\r\n *\r\n * @param {Mixed} val\r\n * @return {Boolean}\r\n * @api private\r\n */\r\n\r\nfunction isObject(val) {\r\n    return Object == val.constructor;\r\n}\n\n//# sourceURL=webpack:///./src/co-4.x.js?");

/***/ }),

/***/ "./src/promisify.js":
/*!**************************!*\
  !*** ./src/promisify.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * 基于回调的函数 promise 化\r\n * 用于 Generator 函数的自动流程管理的Promise 函数\r\n * \r\n * @param {Function} fn 需要promisify 的目标函数\r\n */\r\nfunction promisify(fn) {\r\n    return function () {\r\n        var ctx = this;\r\n        var args = Array.prototype.slice.call(arguments);\r\n\r\n        return new Promise(function (resolve, reject) {\r\n            // 增加callback 函数参数大于等于3个兼容\r\n            // 当参数大于等于3个时 resolve的data是一个数组\r\n            args.push(function () {\r\n                var args2 = Array.prototype.slice.call(arguments);\r\n                var err = args2[0];\r\n                if (err) return reject(err);\r\n\r\n                var data = args2.slice(1);\r\n                if (data.length > 1) {\r\n                    resolve(data);\r\n                } else {\r\n                    resolve(data[0]);\r\n                }\r\n            });\r\n            fn.apply(ctx, args);\r\n        });\r\n    };\r\n}\r\n\r\nmodule.exports = promisify;\r\n\n\n//# sourceURL=webpack:///./src/promisify.js?");

/***/ }),

/***/ "./src/thunkify.js":
/*!*************************!*\
  !*** ./src/thunkify.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * 专为Generator Function 设计的thunkify 函数\r\n * Thunkify 函数有什么用？回答是以前确实没什么用\r\n * 但是 ES6 有了 Generator 函数，Thunkify 函数现在可以用于 Generator 函数的自动流程管理。\r\n * \r\n * @param {Function} fn 需要thunkify 的目标函数\r\n * @see https://github.com/tj/node-thunkify \r\n */\r\nfunction thunkify(fn) {\r\n    return function() {\r\n        var args = new Array(arguments.length);\r\n        var ctx = this;\r\n\r\n        for (var i = 0; i < args.length; ++i) {\r\n            args[i] = arguments[i];\r\n        }\r\n\r\n        return function(done) {\r\n            var called;\r\n\r\n            args.push(function() {\r\n                if (called) return;\r\n                called = true;\r\n                done.apply(null, arguments);\r\n            });\r\n\r\n            try {\r\n                fn.apply(ctx, args);\r\n            } catch (error) {\r\n                done(error);\r\n            }\r\n        };\r\n    };\r\n}\r\n\r\nmodule.exports = thunkify;\r\n\n\n//# sourceURL=webpack:///./src/thunkify.js?");

/***/ })

/******/ });
});