const RestError = require('./rest.error');

class UnauthorizedError extends RestError {

	constructor() {
		super('unauthorized', 401);
	}

}

module.exports = UnauthorizedError;
