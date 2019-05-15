if (!process.env.NODE_ENV) {
	throw new Error('NODE_ENV is empty. You need to use scripts commands. (package.json)');
}
const async = require('async');
const path = require('path');
const config = require('config');
const { listModules, asValue } = require('awilix');
const express = require('express');
const logger = require('log4js').getLogger('init.http.server');
const { container, initModule } = require('./awilix.http.server');
const { getUrlPaths } = require('./utils/redis.utils');

logger.level = 'debug';

if (process.env.NODE_ENV === 'production') {
	const {
		port, host, password,
	} = getUrlPaths(process.env.REDIS_URL);

	config.redis = {
		port,
		host,
		password,
		db: 0,
	};
	config.JWT_SECRET = process.env.JWT_SECRET;
	config.EMAIL_SETTINGS.TRANSPORTER.AUTH.PASSWORD = process.env.EMAIL_SENDER_PASS;
	config.CURRENCY_CONVERTER_API_KEY = process.env.CURRENCY_CONVERTER_API_KEY;

	console.log(config.EMAIL_SETTINGS);
}

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
	const server = app.listen(process.env.PORT || config.website.port, config.website.host);

	container.register({
		server: asValue(server),
	});

	app.disable('x-powered-by');

	async.waterfall([
		(callback) => initConnections(callback),
		(callback) => {
			const apiRouter = express.Router();

			app.use('/api/v1', apiRouter);

			app.use(express.static(path.join(__dirname, config.PUBLIC_PATHS.BASE)));
			app.use((req, res) => {
				res.sendFile(path.join(__dirname, config.PUBLIC_PATHS.BASE, 'index.html'));
			});

			return initModule('api.module', { router: apiRouter }, (err) => callback(err));
		},
		(callback) => initModule('notifier.module', {}, (err) => callback(err)),
	], (err) => {
		if (err) {
			console.log('Start Main Process', err);
		}
	});

};


(function init() {
	startMainProcess();
}());


process.on('uncaughtException', (err) => {
	logger.error(err);
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MAIN PROCESS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', err);
});


// TODO
// 1. pm2 cluster https://github.com/talyssonoc/node-api-boilerplate/blob/master/cluster.js
// 2. replace client here and in heroku-prebuild: cd client && npm install / heroku-postbuild: cd client && npm build
// 3. autocreating realty-images
