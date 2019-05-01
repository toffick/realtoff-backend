const lodash = require('lodash');
const { USER_ROLES } = require('../constants/constants');

class AccessToken {

	constructor(raw, payload) {

		if (!lodash.isString(raw)) {
			throw new Error('Wrong token: raw');
		}

		if (!lodash.isObject(payload)) {
			throw new Error('Wrong token: payload');
		}

		if (!payload.id) {
			throw new Error('Wrong token: id');
		}

		if (!USER_ROLES[payload.role]) {
			throw new Error('Wrong token: role');
		}

		if (!lodash.isSafeInteger(payload.id)) {
			throw new Error('Invalid token: id');
		}

		this.raw = raw;
		this.userId = payload.id;
		this.role = payload.role;
		this.payload = payload;


	}

	getRawToken() {
		return this.raw;
	}

	getPayload() {
		return this.payload;
	}

	getUserId() {
		return this.userId;
	}

	getRole() {
		return this.role;
	}

}

module.exports = AccessToken;
