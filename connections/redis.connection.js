const logger = require('log4js').getLogger('redis.connection');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


/**
 * A namespace.
 * @namespace connections
 * @class RedisConnection
 */
class RedisConnection {

	/**
	 *
	 * @param {Object} opts.config
	 */
	constructor(opts) {
		this.config = opts.config;
		this.redisClient = null;
	}

	/**
	 *
	 * @param {Function} next
	 * @returns {*}
	 */
	connect(next) {

		logger.info('Start connecting to Redis...');

		this.redisClient = this.getNewClient();

		return this.redisClient.select(this.config.redis.db, () => {
			logger.info('Redis is connected.');
			return next();
		});
	}

	/**
	 *
	 * @returns {null}
	 */
	getClient() {
		return this.redisClient;
	}

	/**
	 *
	 * @returns {RedisClient}
	 */
	getNewClient() {
		const {
			port, host, db, password,
		} = this.config.redis;
		return redis.createClient(port, host, { db, password });
	}


}

module.exports = RedisConnection;
