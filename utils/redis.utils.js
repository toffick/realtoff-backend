const url = require('url');

module.exports = {
	getUrlPaths: (redisUrl) => {
		const redisURL = url.parse(redisUrl);

		return {
			port: redisURL.port,
			host: redisURL.host.split(':')[0],
			password: redisURL.auth.split(':')[1],
		};
	},
};
