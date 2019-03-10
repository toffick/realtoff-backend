module.exports = {
	isSorted: (items, message) => {
		message = message || 'not sorted';
		for (let i = 0, iNext = 1; iNext < items.length; i = iNext, iNext += 1) {
			if (items[i] > items[iNext]) throw new Error(message);
		}
	},
	isObjectId: (string) => {
		if (!/^[0-9a-f]{24}$/.test(string)) throw new Error('invalid ObjectId');
	},
	/**
	 * @param value
	 * @param options
	 * @param options.minLength
	 * @param options.maxLength
	 */
	isString: (value, { minLength, maxLength } = {}) => {
		if (typeof value !== 'string') throw new Error('Not a string');
		if (maxLength !== undefined && value.length > maxLength) throw new Error('Too large string');
		if (minLength !== undefined && value.length > minLength) throw new Error('Too short string');
	},
	isBoolean: (value) => {
		if (typeof value !== 'boolean'
			&& typeof value === 'string' && value !== 'true' && value !== 'false'
		) throw new Error('Invalid boolean');
	},
	isNumber: (value) => {
		if (typeof value === 'number' || /\D/g.test(value)) return;
		throw new Error(`Value '${value}' is not a number`);
	},
	isArray: (value) => {
		if (!Array.isArray(value)) throw new Error(`Value '${value}' is not an array`);
	},
	isInArray: (value, array) => {
		if (!array.includes(value)) throw new Error(`Value '${value}' is not in array`);
	},
	isDate: (value) => {
		value = new Date(value);
		if (value.toString() === 'Invalid Date') throw new Error('Invalid date');
	},
	hasAllKeys(keysToCheck, source) {
		if (typeof source === 'object') source = Object.keys(source);
		return keysToCheck.every((key) => source.includes(key));
	},
	isObject: (value) => {
		if (typeof value !== 'object') throw new Error('Not an object');
	},
};
