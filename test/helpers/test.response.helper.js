/* eslint-disable no-unused-expressions */
require('chai').should();

module.exports = {
	isError: (res, status) => {
		res.should.have.status(status);
		res.should.be.json;
		res.body.should.be.a('object');
		res.body.should.not.have.property('result');
		res.body.should.have.property('error');
	},
	isSuccess: (res) => {
		res.should.have.status(200);
		res.should.be.json;
		res.body.should.be.a('object');
		res.body.should.have.property('result');
		res.body.should.not.have.property('error');
	},
};
