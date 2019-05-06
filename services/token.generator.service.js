const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const _ = require('lodash');

const DEFAULT_RANDOM_TOKEN_SIZE = 64;
const PREFIX = 'JWT ';


class TokenGeneratorService {

	/**
	 *
	 * @param {Object} config
	 */
	constructor({ config }) {
		this.config = config;
	}

	/**
	 *
	 * @param {undefined|Number?} size
	 * @return {Promise.<String>}
	 */
	async generateRandomToken(size) {

		if (!size) {
			size = DEFAULT_RANDOM_TOKEN_SIZE;
		}

		return new Promise((resolve) => {
			crypto.randomBytes(size, (err, buffer) => resolve(buffer.toString('hex')));
		});

	}

	/**
	 *
	 * @param {Object} data
	 * @param {String} expiresIn
	 * @return {Promise.<String>}
	 */
	async generateJwtToken({ data, expiresIn }) {
		const token = jwt.sign(data, this.config.JWT_SECRET, { expiresIn });

		return `${PREFIX}${token}`;
	}

	/**
	 *
	 * @param {String} token
	 * @return {Promise.<*>}
	 */
	async isValidToken(token) {

		const regExpPrefix = new RegExp(`^${PREFIX}`);

		if (!token || !_.isString(token) || !regExpPrefix.test(token)) {
			return false;
		}

		const tokenWithoutPrefix = token.replace(regExpPrefix, '');

		try {

			jwt.verify(tokenWithoutPrefix, this.config.JWT_SECRET);

			return true;

		} catch (e) {
			return false;
		}

	}

	/**
	 *
	 * @param {String} token
	 * @param {String} type
	 * @return {Promise.<*>}
	 */
	async decodeToken(token, type) {

		const regExpPrefix = new RegExp(`^${PREFIX}`);

		if (!token || !_.isString(token) || !regExpPrefix.test(token)) {
			return null;
		}

		const tokenWithoutPrefix = token.replace(regExpPrefix, '');

		try {

			const jwtDecoded = jwt.verify(tokenWithoutPrefix, this.config.JWT_SECRET);

			if (jwtDecoded.type !== type) {
				return null;
			}

			return jwtDecoded;

		} catch (e) {
			return null;
		}

	}

}

module.exports = TokenGeneratorService;
