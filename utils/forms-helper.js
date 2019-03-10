const mongoose = require('mongoose');

const number = (value) => {
	if (typeof value === 'string') value = Number.parseFloat(value);
	if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Is not a number');
	return value;
};

const safeInteger = (value) => {
	value = number(value);
	if (!Number.isSafeInteger(value)) throw new Error('Is not a safe integer');
	return value;
};

const lte = (value, limit) => {
	if (value > limit) throw new Error(`Must be less than or equal to ${limit}`);
	return value;
};

const gte = (value, limit) => {
	if (value < limit) throw new Error(`Must be greater than or equal to ${limit}`);
	return value;
};

const gt = (value, limit) => {
	if (value <= limit) throw new Error(`Must be greater than ${limit}`);
	return value;
};

const string = (value) => {
	if (typeof value !== 'string') throw new Error('Must be a string');
	return value;
};

module.exports = {
	number,
	safeInteger,
	lte,
	gte,
	gt,
	object: (value) => {
		if (typeof value !== 'object') throw new Error('Is not a object');
		return value;
	},
	unsignedSafeInteger: (value) => {
		value = safeInteger(value);
		gte(value, 0);
		return value;
	},
	positiveSafeInteger: (value) => {
		value = safeInteger(value);
		gt(value, 0);
		return value;
	},
	length: (value, min, max) => {
		string(value);
		if (typeof max !== 'number') max = min;
		if (value.length < min || value.length > max) throw new Error(`Length must be in range [${min}; ${max}]`);
		return value;
	},
	objectId: (id) => {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error('Id has invalid format');
		}
	},
	MACAddress: (value) => {
		string(value);
		if (!/^([a-f\d]{2}:){5}[a-f\d]{2}$/.test(value)) throw new Error('Invalid MAC-address format');
		return value;
	},
	boolean: (value) => {
		if (typeof value === 'boolean') return value;
		if (value === 'true') return true;
		if (value === 'false') return false;
		throw new Error('Invalid boolean');
	},
	date: (value) => {
		value = new Date(value);
		if (value.toString() === 'Invalid Date') throw new Error('Invalid date');
		return value;
	},
	inArray: (value, fields = []) => {
		if (!fields.includes(value)) throw new Error(`Must be one of the next: ${fields.join(', ')}`);
	},
	string(value) {
		if (typeof value !== 'string') throw new Error('Invalid string');
	},
};
