const { initModule } = require('../awilix');

process.env.NODE_ENV = 'test';

let apiModule;

module.exports = async () => {
	if (apiModule) return apiModule;
	apiModule = await initModule('api.module');
	return apiModule;
};
