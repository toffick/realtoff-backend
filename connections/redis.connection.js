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
	 * @param {AppConfig} opts.config
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

	getClient() {
		return this.redisClient;
	}


	getNewClient() {
		return redis.createClient(this.config.redis.port, this.config.redis.host, { db: this.config.redis.db });
	}


}

module.exports = RedisConnection;
