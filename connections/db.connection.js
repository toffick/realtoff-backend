const logger = require('log4js').getLogger('db.connection');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * A namespace.
 * @namespace connections
 * @class DbConnection
 */
class DbConnection {

	/**
	 *
	 * @param {AppConfig} opts.config
	 */
	constructor(opts) {
		this.config = opts.config;
		this.sequelize = null;
		this.Sequelize = Sequelize;
		this.models = {};

	}

	/**
	 *
	 * @param {Function} next
	 * @returns {*}
	 */
	connect(next) {

		logger.info('Start connecting to PostgreSQL...');

		this.sequelize = new Sequelize(this.config.db.database, this.config.db.username, this.config.db.password, {
			dialect: this.config.db.dialect,
			host: this.config.db.host,
			pool: {
				max: 30,
			},
		});

		fs.readdirSync(path.resolve(__dirname, '../models'))
			.filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
			.forEach((file) => {
				const model = this.sequelize.import(path.join(path.resolve(__dirname, '../models'), file));
				this.models[model.name] = model;
			});

		Object.keys(this.models).forEach((modelName) => {
			if (this.models[modelName].associate) {
				this.models[modelName].associate(this.models);
			}
		});

		logger.info('PostgreSQL is connected.');

		return next();

	}

}

module.exports = DbConnection;
