const { promisifyAll } = require('bluebird');


class TemporaryRepository {


	/**
	 *
	 * @param {RedisConnection} redisConnection
	 */
	constructor({ redisConnection }) {
		this.redisClientAsync = promisifyAll(redisConnection.getClient());
	}


	/**
	 *
	 * @param {String} key
	 * @param {String} type
	 * @param {*} data
	 * @param {Number} storageTime seconds
	 */
	async saveData(key, data, storageTime) {
		const saveResult = await this.redisClientAsync.setAsync(key, JSON.stringify(data), 'EX', storageTime);
		return saveResult === 'OK';
	}


	/**
	 *
	 * @param key
	 */
	async fetchData(key) {
		const data = await this.redisClientAsync.getAsync(key);
		return data ? JSON.parse(data) : null;
	}

	/**
	 *
	 * @param userId
	 * @param type
	 * @return {Promise<*>}
	 */
	async removeData(key) {
		return this.redisClientAsync.delAsync(key);
	}

}

TemporaryRepository.prototype.KEYS = {
	EMAIL_RECENTLY_CONFIRMED: 'EMAIL:RECENTLY_CONFIRMED',
	BANNED_USER: 'USER:BANNED',
};

module.exports = TemporaryRepository;
