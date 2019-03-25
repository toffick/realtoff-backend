const ResponseError = require('../errors/response.error');

class BaseForm {

	constructor() {
		this.errors = [];
	}

	validate() {
		return this;
	}

	isValid() {
		return !this.errors.length;
	}

	/**
	 *
	 * @param {String} message
	 * @param {String} param
	 */
	addError(message, param) {
		this.errors.push(new ResponseError(message, param));
	}

	hasErrors() {
		return !!this.errors.length;
	}

	getErrors() {
		return this.errors;
	}

}

module.exports = BaseForm;
