class Range {

	/**
	 *
	 * @param min
	 * @param max
	 * @return {Array}
	 */
	static createRange(min = 0, max = 0) {
		const range = [];
		for (let i = min; i <= max; i++) {
			range.push(i);
		}

		return range;
	}

}

module.exports = Range;
