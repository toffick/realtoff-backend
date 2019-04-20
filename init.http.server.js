if (!process.env.NODE_ENV) {
	throw new Error('NODE_ENV is empty. You need to use scripts commands. (package.json)');
}
const async = require('async');
const config = require('config');
const { listModules, asValue } = require('awilix');
const express = require('express');
const logger = require('log4js').getLogger('init.http.server');
const { container, initModule } = require('./awilix.http.server');

logger.level = 'debug';
// Read all pool configs from pool_configs and join them with their coin profile

container.register({
	config: asValue(config),
});


const initConnections = (cb) => {
	const connections = listModules(['connections/*.js']);
	async.eachSeries(connections, ({ name }, cb) => {
		container.resolve(name.replace(/\.([a-z])/, (a) => a[1].toUpperCase())).connect((err) => {
			if (err) {
				logger.error(`${name} connect error`);
				logger.error(err);
				return process.exit(1);
			}
			return cb();
		});
	}, cb);
};


const startMainProcess = () => {
	const app = express();
	const server = app.listen(config.website.port, config.website.host);

	container.register({
		server: asValue(server),
	});

	app.disable('x-powered-by');

	async.waterfall([
		(callback) => initConnections(callback),
		(callback) => {
			const apiRouter = express.Router();

			app.use('/api/v1', apiRouter);
			app.use(config.PUBLIC_PATHS.BASE, express.static(__dirname + config.PUBLIC_PATHS.BASE));

			return initModule('api.module', { router: apiRouter }, (err) => callback(err));
		},
		(callback) => initModule('notifier.module', {}, (err) => callback(err)),
	], (err) => {
		if (err) {
			console.log('Start Main Pr	ocess', err);
		}
	});

};


(function init() {
	startMainProcess();
}());


process.on('uncaughtException', (err) => {
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MAIN PROCESS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', err);
});
