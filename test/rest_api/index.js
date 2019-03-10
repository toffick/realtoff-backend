/* eslint-disable global-require */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('REST API', () => {
	describe('user.controller', () => {
		require('./controllers/user.controller.test');
	});
});
