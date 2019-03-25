/**
 * A namespace.
 * @namespace components
 * @class ResponseError
 */
class ResponseError {

	/**
     *
     * @param {String} message
     * @param {String} param
     */
	constructor(message, param) {
		this.message = message;
		this.param = param;
	}

}

module.exports = ResponseError;
