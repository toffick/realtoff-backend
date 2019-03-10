module.exports = {
	authorize: (agent, data, done) => {
		agent.post('/api/v1/sign-in').send(data).end((err, res) => {
			res.should.have.status(200);
			done();
		});
	},
	deauthorize: (agent, done) => {
		agent.get('/api/v1/sign-out').end((err, res) => {
			res.should.have.status(200);
			done();
		});
	},
	formQuery(path, object) {
		if (typeof path === 'object') {
			object = path;
			path = '';
		}
		const paramString = Object.keys(object).map((key) => `${key}=${object[key]}`).join('&');
		return `${path}?${paramString}`;
	},
	routeQuery(path = '', object = {}) {
		Object.keys(object).forEach((key) => {
			path = path.replace(`:${key}`, object[key]);
		});
		return path;
	},
};
