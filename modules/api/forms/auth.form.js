const form = require('express-form');
const { field } = require('express-form');

const UnauthorizedError = require('../../../errors/unauthorized.error');

class AuthForm {

	verifyAuthData() {
		return form(
			field('name').trim().required(),
			field('password').trim().required().minLength(9),
		);
	}

	onlyLogged() {
		return (req) => {
			if (!req.isAuthenticated()) throw new UnauthorizedError();
		};
	}

}

module.exports = AuthForm;
