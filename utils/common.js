const BN = require('bignumber.js');
const assert = require('assert');

/**
 * creates new array with passed size using the function to fill. Can be used
 * @param {Object|Number} options options object or number (size)
 * @param {Number?} options.size size of the array
 * @param {Boolean?} options.await if true the function returns Promise.all(resultArray)
 * @param {Function} func function used size times. Can be async
 * @return {Array|Promise<Array>}
 */
function fillArray(options, func) {
	if (typeof options === 'number') {
		options = { size: options };
	}
	const array = new Array(options.size);
	for (let i = 0; i < options.size; i += 1) {
		array[i] = func();
	}
	return options.await ? Promise.all(array) : array;
}

/**
 * Convert array of object to map-object
 * @param {Object|String|Function} options options object or options.key if string or function
 * @param {String|Function?} options.key name of a field to use as a key. If a function,
 * it's called every time (array.length) to get a key, passing an array item
 * @param {Object[]} array array of object. Every item must contain a field named as a value of options.key
 * @param {Object?} startMap an object to start reduce with. Used by reference
 * @return {Object}
 */
function arrayToMap(options, array, startMap) {
	if (typeof options !== 'object') options = { key: options };
	const getKey = typeof options.key === 'function' ? options.key : (item) => item[options.key];
	return array.reduce((map, item) => {
		const key = getKey(item);
		map[key] = item;
		return map;
	}, startMap || {});
}

/**
 * @param {Array} array
 * @param {String?} field if first parameter is array of objects, pass key to sum
 * @return {*}
 */
function arraySum(array, field) {
	return array.reduce((sum, one) => {
		if (field) ({ [field]: one } = one);
		return sum.plus(one);
	}, new BN(0)).toNumber();
}

/**
 * returns summary of object values
 * @param {Object} object
 * @returns {number}
 */
function sumOfObjectValues(object) {
	return Object.values(object).reduce((sum, one) => sum + one, 0);
}

/**
 * Compare arrays. Every item of the first array must be in the second array.
 * Sorting doesn't matter.
 * @param {Array} firstArr
 * @param {Array} secondArr
 */
function checkArrays(firstArr, secondArr) {
	const counts = new Map();
	// eslint-disable-next-line no-restricted-syntax
	for (const a of firstArr) {
		const count = counts.get(a);
		counts.set(a, count === undefined ? 1 : count + 1);
	}
	// eslint-disable-next-line no-restricted-syntax
	for (const a of secondArr) {
		const count = counts.get(a);
		assert.ok(count);
		counts.set(a, count - 1);
	}
}

/**
 * returns min and max numbers of the array
 * @param {number[]} array
 * @returns {[number, number]} min and max
 */
function findMinAndMax(array) {
	let min = array[0];
	let max = array[0];
	array.forEach((item) => {
		if (item > max) max = item;
		if (item < min) min = item;
	});
	return [min, max];
}

/**
 * Adds stringified parameters to the GET method url
 * @param {String|Object} path if an object, returns only parameters string
 * @param {Object?} object an object of parameters
 * @return {String} parameters string
 */
function formQuery(path, object) {
	if (typeof path === 'object') {
		object = path;
		path = '';
	}
	const paramString = Object.keys(object).map((key) => `${key}=${object[key]}`).join('&');
	return `${path}?${paramString}`;
}

/**
 * BE CARE WITH CONTEXT. Promisifies a callback function.
 * @param {Function} func
 * @param {*} args
 * @returns {Promise<*>}
 */
function promisify(func, ...args) {
	return new Promise((resolve, reject) => {
		func(...args, (err, ...result) => (err ? reject(err) : resolve(...result)));
	});
}

/**
 * Converts value to string, if it is not null\undefined
 * @param {*} value
 * @returns {string}
 */
function safeToString(value) {
	return value === null || value === undefined ? value : value.toString();
}

module.exports = {
	fillArray,
	arrayToMap,
	arraySum,
	sumOfObjectValues,
	checkArrays,
	findMinAndMax,
	formQuery,
	promisify,
	safeToString,
};
