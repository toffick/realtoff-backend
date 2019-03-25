

class SignOutTokenRepository {

	/**
	 *
	 * @param {Object} config
	 * @param {RedisConnection} redisConnection
	 */
	constructor({ config, redisConnection }) {
		this.config = config;
		this.redisConnection = redisConnection;
		this.redisClient = this.redisConnection.getClient();
	}

	/**
	 *
	 * @param {String} token
	 * @return {Promise}
	 */
	addSignOutToken(token) {

		return new Promise((resolve, reject) => {

			const keyName = `services:sign_out_tokens:${token}`;

			return this.redisClient.multi([
				['set', keyName, 1],
				['expire', keyName, 86400]
			]).exec((err, res) => {

				if (err) {
					return reject(err);
				}

				return resolve(!!(res && res[0] === 'OK' && res[1] === 1));

			});

		});

	}

	/**
	 *
	 * @param {String} token
	 * @return {Promise}
	 */
	async isSignOutToken(token) {

		const keyName = `services:sign_out_tokens:${token}`;

		return new Promise((resolve, reject) => this.redisClient.get(keyName, (err, res) => {

			if (err) {
				return reject(err);
			}

			return resolve(!!res);

		}));

	}

}

module.exports = SignOutTokenRepository;
