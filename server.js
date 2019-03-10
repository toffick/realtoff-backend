const { listModules } = require('awilix');
/** @type AppConfig */
const config = require('config');
const { getLogger } = require('log4js');

const { container, initModule } = require('./awilix');

const logger = getLogger();
const currentModule = process.env.MODULE;

(async () => {
	try {
		await container.resolve('ravenHelper').init();
		const connections = listModules(['connections/*.js']);
		await Promise.all(connections.map(async ({ name }) => {
			try {
				await container.resolve(name.replace(/\.([a-z])/, (a) => a[1].toUpperCase())).connect();
			} catch (error) {
				logger.error(`${name} connect error`);
				logger.error(error);
				process.exit(1);
			}
		}));
		await initModule(`${currentModule}.module`);
	} catch (err) {
		logger.warn('Start error');
		logger.warn(err);
	} finally {
		logger.info(`${currentModule || 'server'} has been started`);
	}
})();

RegExp.escape = (str) => String(str).replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');

/**
 * @typedef {Object} MongooseDocument
 * @property {String} _id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {function():Promise<void>} save
 * @property {function():Promise<void>} remove
 */

/**
 * @typedef {Object} MongooseCollection
 * @property {function():Promise<Object.<[[*]]>>} getIndexes
 * @property {function(name:String)} dropIndex
 */

/**
 * @typedef {Object} MongooseModel
 * @property {MongooseCollection} collection
 */

/**
 * @typedef {Object} AppConfig
 * @property {Boolean} cors
 * @property {{host:String, port:String|Number, database:String, user:String, password:String}} db
 * @property {{username:String, password:String, url:String}} jira
 * @property {{level:String}} logger
 * @property {String} port
 * @property {{enabled:Boolean, config:String}} raven
 * @property {{service:String, user:String, pass:String}} mailer
 * @property {String} session_secret
 */
