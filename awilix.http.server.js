const awilix = require('awilix');
const config = require('config');
const log4js = require('log4js');
const logger = require('log4js').getLogger();

logger.level = 'debug';
const {
	Lifetime, InjectionMode, asClass, asValue,
} = require('awilix');

// create awilix container
const container = awilix.createContainer({
	injectionMode: InjectionMode.PROXY,
});

container.register({
	config: asValue(config),
	basePath: __dirname,
	loggerCreator: asValue(log4js),
});

// load modules
container.loadModules([
	['services/*.js', { register: asClass }],
	// ['services/exchanges/*.js', { register: asClass }],
	['services/stats/*.js', { register: asClass }],
	['components/errors/errors.handler.js', { register: asClass }],
	['components/validators/*', { register: asClass }],
	['components/events/*.js', { register: asClass }],
	['components/email.template.renderer.js', { register: asClass }],
	['components/email.transporter.js', { register: asClass }],
	['helpers/*.js', { register: asClass }],
	['connections/db.connection.js', { register: asClass }],
	['connections/redis.connection.js', { register: asClass }],
	['repositories/*.js', { register: asClass }],
	['repositories/rpc/*.js', { register: asClass }],
	['repositories/config/*.js', { register: asClass }],
	['modules/api/*.js', { register: asClass }],
], {
	formatName: 'camelCase',
	resolverOptions: {
		lifetime: Lifetime.SINGLETON,
		injectionMode: InjectionMode.PROXY,
	},
});

module.exports = {
	container,
	initModule: (name, options, cb) => {

		const scope = container.createScope();

		scope.loadModules([
			[`modules/${name.replace(/\.[a-z]+$/, '')}/*/*.js`, { register: asClass }],
		], {
			formatName: 'camelCase',
			resolverOptions: {
				lifetime: Lifetime.SCOPED,
				injectionMode: InjectionMode.PROXY,
			},
		});

		logger.info(`Init ${name.replace(/\.[a-z]+$/, '')} module`);

		if (typeof scope.resolve(name.replace(/\.([a-z])/g, (a) => a[1].toUpperCase())).initModule !== 'function') {
			throw new Error(`module ${name} not contain a method "initModule"`);
		}

		scope.resolve(name.replace(/\.([a-z])/g, (a) => a[1].toUpperCase())).initModule(options, (err) => {

			if (err) {
				logger.error(`init ${name} module error`);
				logger.error(err);
			}

			return cb(err);

		});

	},

};
