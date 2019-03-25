/**
 * A namespace.
 * @namespace components
 * @class CustomError
 */
class CustomError {


	/**
	 *
	 * @param {String} message
	 * @param {String} param
	 * @param {Number} code
	 */
	constructor(message, param, code) {
		this.message = message || 'Internal error';
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


	/**
	 *
	 * @return {Object}
	 */
	getError() {
		return {
			message: this.message,
			param: this.param
		};
	}


}

module.exports = CustomError;
