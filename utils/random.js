
/**
 * Randoms an int. If to > from, swaps
 * @param {number} to. Default: 0
 * @param {number} from
 * @returns {number}
 */
function randomInt(to, from = 0) {
	if (to === undefined) throw new Error('to is required');
	if (to === from) return to;
	if (to < from) {
		const temp = to;
		to = from;
		from = temp;
	}

	return Math.floor(Math.random() * ((to - from) + 1)) + from;
}

/**
 * Returns a random date from now-interval to now
 * @param {number} interval (ms)
 * @returns {Date}
 */
function randomDateFromInterval(interval = 1000 * 60 * 60 * 24 * 30 * 6) {
	return new Date(new Date().getTime() - randomInt(interval));
}

/**
 * @param {Date} from
 * @param {Date} to
 * @returns {Date}
 */
function randomDate(from = randomDateFromInterval(), to = new Date()) {
	to = to.getTime();
	from = from.getTime();
	if (from > to) {
		const temp = to;
		to = from;
		from = temp;
	}
	return new Date(randomInt(from, to));
}

/**
 * Execute function based random luck
 * @param {Number} percent (float)
 * @param {*} lucky if it is a function, then returns its result
 * @param {*?} unlucky
 * @return {*}
 */
// todo refactor math
function luckyDo(percent, lucky, unlucky) {
	const formResponse = (any) => (typeof any === 'function' ? any() : any);
	return formResponse(Math.random() > percent ? unlucky : lucky);
}


/**
 * returns an random element of the passed array
 * @param {Array} array
 * @return {*} random element of the array
 */
function getRandomArrayItem(array) {
	return array[randomInt(array.length - 1)];
}

module.exports = {
	randomDate,
	randomInt,
	randomDateFromInterval,
	luckyDo,
	getRandomArrayItem,
};
