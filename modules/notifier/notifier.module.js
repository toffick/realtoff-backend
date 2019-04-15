const log4js = require('log4js');
const logger = require('log4js').getLogger('notifier.module.js');

logger.level = 'debug';

/**
 * A namespace.
 * @namespace notifier
 * @class NotifierModule
 */
class NotifierModule {

	/**
	 *
	 * @param config
	 * @param {RealtyController} realtyController
	 * @param {UserWatcher} userWatcher
	 * @param {ErrorsHandler} errorsHandler
	 */
	constructor({
		config,
					userWatcher,
		errorsHandler,
	}) {
		this.config = config;
		this.userWatcher = userWatcher;
		this.errorsHandler = errorsHandler;

	}

	/**
	 * Start HTTP server listener
	 */
	initModule(options, next) {

		this.userWatcher.init();

		return next();

	}

}

module.exports = NotifierModule;
