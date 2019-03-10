const RestError = require('./rest.error');

class FormError extends RestError {

	constructor(formErrors = null, status = 400) {
		if (typeof formErrors === 'number') {
			status = formErrors;
			formErrors = null;
		}
		super('invalid form format', status, formErrors);
	}

	add(key, error) {
		if (!error || !error.length) return this;
		if (!this.details || typeof this.details !== 'object') this.details = {};
		if (!this.details[key]) this.details[key] = [];
		this.details[key].push(...(Array.isArray(error) ? error : [error]));
		return this;
	}

	isEmpty() {
		return !this.details;
	}

}

module.exports = FormError;
