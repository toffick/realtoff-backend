const lodash = require('lodash');

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

		if (!lodash.isSafeInteger(payload.id)) {
			throw new Error('Invalid token: id');
		}

		this.raw = raw;
		this.userId = payload.id;
		this.appId = payload.desktopAppId;
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

	getAppId() {
		return this.appId;
	}

}

module.exports = AccessToken;
