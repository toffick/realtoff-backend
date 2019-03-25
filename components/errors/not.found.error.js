/**
 * A namespace.
 * @namespace components
 * @class NotFoundError
 */
class NotFoundError {

	/**
	 *
	 * @param {String} message
	 * @param {String} param
	 * @param {Number} code
	 */
	constructor(message, param, code) {
		this.message = message || 'Not Found';
		this.param = param;
		this.code = code || 404;
	}

	/**
	 *
	 * @return {Number}
	 */
	getCode() {
		return this.code;
	}

}

module.exports = NotFoundError;
