const validator = require('validator');

// When validator upgraded to v5, they removed automatic string coercion
// The next few methods (up to validator.init()) restores that functionality
// so that express-validator can continue to function normally
validator.extend = function (name, fn) {
	validator[name] = function () {
		const args = Array.prototype.slice.call(arguments);
		args[0] = validator.toString(args[0]);
		return fn.apply(validator, args);
	};
};

validator.init = function () {
	for (const name in validator) {
		if (typeof validator[name] !== 'function' || name === 'toString'
            || name === 'toDate' || name === 'extend' || name === 'init'
            || name === 'isServerSide') {
			continue;
		}
		validator.extend(name, validator[name]);
	}
};

validator.toString = function (input) {
	if (typeof input === 'object' && input !== null && input.toString) {
		input = input.toString();
	} else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
		input = '';
	}
	return `${input}`;
};

validator.toDate = function (date) {
	if (Object.prototype.toString.call(date) === '[object Date]') {
		return date;
	}
	date = Date.parse(date);
	return !isNaN(date) ? new Date(date) : null;
};

validator.init();

module.exports = validator;
