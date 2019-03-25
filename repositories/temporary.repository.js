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
	async saveData(key, type, data, storageTime) {
		const saveResult = await this.redisClientAsync.setAsync(`${key}_${type}`, JSON.stringify(data), 'EX', storageTime);
		return saveResult === 'OK';
	}


	/**
	 *
	 * @param {Number} userId
	 * @param {String} type
	 */
	async fetchData(userId, type) {
		const data = await this.redisClientAsync.getAsync(`${userId}_${type}`);
		return data ? JSON.parse(data) : null;
	}


	/**
	 *
	 * @param {Number} userId
	 * @param {String} type
	 */
	async isDataExist(userId, type) {
		return this.redisClientAsync.existsAsync(`${userId}_${type}`);
	}

	/**
	 *
	 * @param userId
	 * @param type
	 * @return {Promise<*>}
	 */
	async removeData(userId, type){
		return this.redisClientAsync.delAsync(`${userId}_${type}`);
	}

}


module.exports = TemporaryRepository;
