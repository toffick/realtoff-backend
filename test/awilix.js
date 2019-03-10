const awilix = require('awilix');
/** @type AppConfig */
const CONFIG = require('config');
const { getLogger } = require('log4js');

const {
	Lifetime, InjectionMode, asClass, listModules, asValue,
} = awilix;

const envConfigs = [{ env: 'JIRA_PASSWORD', path: 'jira', field: 'password' }];

const logger = getLogger();
logger.level = CONFIG.logger.level || 'info';

envConfigs.forEach(({ env, path, field }) => {
	const value = process.env[env] || null;
	if (!value) return;
	let objectToUpdate = CONFIG;
	path.split('.').forEach((propertyName) => {
		objectToUpdate = objectToUpdate[propertyName];
	});
	objectToUpdate[field] = value;
});

// create awilix container
const container = awilix.createContainer({
	injectionMode: InjectionMode.PROXY,
});

// load modules
container.loadModules([
	['services/*.js', { register: asClass }],
	['helpers/*.js', { register: asClass }],
	['connections/*.js', { register: asClass }],
	['repositories/*.js', { register: asClass }],
	['modules/*/*.js', { register: asClass }],
	['workers/*/*.js', { register: asClass }],
	['test/awilix.substitutions/*.js', { register: asClass }],
], {
	formatName: 'camelCase',
	resolverOptions: {
		lifetime: Lifetime.SINGLETON,
		injectionMode: InjectionMode.PROXY,
	},
});

// init workers with proxy mode for simple prototyping
container.loadModules([
	['workers/*.js', { register: asClass }],
], {
	formatName: 'camelCase',
	resolverOptions: {
		lifetime: Lifetime.SINGLETON,
		injectionMode: InjectionMode.PROXY,
	},
});

container.register({
	config: asValue(CONFIG),
	basePath: asValue(`${__dirname}/..`),
});

listModules(['modules/*/*.js']).forEach(({ name }) => {
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
});

async function initModule(name, mode) {
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
	const module = scope.resolve(name.replace(/\.([a-z])/, (a) => a[1].toUpperCase()));
	if (typeof module.initModule !== 'function') {
		logger.warn(`module ${name} not contain a method 'initModule'`);
		return null;
	}
	logger.info(`Init ${name.replace(/\.[a-z]+$/, '')} module`);
	try {
		await module.initModule(mode);
	} catch (err) {
		logger.error(`init ${name} module error`);
		logger.error(err);
	}
	return module;
}

module.exports = {
	initModule,
	container,
};
