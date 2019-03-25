
/**
 * A namespace.
 * @namespace components
 * @class ResponseErrors
 */
class ResponseErrors {

	/**
     *
     * @param {Array} errors
     * @param {Number|null} code
     */
	constructor(errors, code) {

		this.errors = errors;
		this.code = code;

		if (!this.code) {
			this.code = 422;
		}

	}

	/**
     *
     * @returns {{code: (number), errors: Array}}
     */
	getResponseErrors() {
		return {
			code: this.getCode(),
			errors: this.getErrors()
		};
	}

	/**
     *
     * @returns {Array}
     */
	getErrors() {
		return this.errors;
	}

	/**
     *
     * @returns {number}
     */
	getCode() {
		return this.code;
	}

}

module.exports = ResponseErrors;
