const logger = require('log4js').getLogger('ErrorHandler');
const ResponseErrors = require('./response.errors');
const ResponseError = require('./response.error');
const NotFoundError = require('./not.found.error');
const CustomError = require('./custom.error');


class ErrorsHandler {

	constructor({ config }) {
		this.config = config;
	}

	/**
	 *
	 * @param {Array} errors
	 */
	createValidateErrorsFromArray(errors) {
		return new ResponseErrors(errors, 422);
	}

	/**
	 *
	 * @param {String} message
	 * @param {String} param
	 * @param {Number} code
	 */
	createValidateErrorsFromText(message, param, code) {
		return new ResponseErrors([new ResponseError(message, param)], code);
	}

	/**
	 *
	 * @param error
	 * @return {Promise}
	 */
	async createUnknownError(error) {

		if (error instanceof NotFoundError) {
			return new Promise((resolve) => resolve(new ResponseErrors([error], error.getCode())));
		}

		if (error instanceof CustomError) {
			return new Promise((resolve) => resolve(new ResponseErrors([error.getError()], error.getCode())));
		}

		logger.error(error);

		return new Promise((resolve) => resolve(new ResponseErrors([], 500)));

	}

}


module.exports = ErrorsHandler;
