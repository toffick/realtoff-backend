/**
 * A namespace.
 * @namespace components
 * @class InternalServerError
 */
class InternalServerError {

	/**
	 *
	 * @param {String} message
	 * @param {String} param
	 * @param {Number} code
	 */
	constructor(message, param, code) {
		this.message = message || 'Internal server error';
		this.param = param;
		this.code = code || 500;
	}

	/**
	 *
	 * @return {Number}
	 */
	getCode() {
		return this.code;
	}

}

module.exports = InternalServerError;
