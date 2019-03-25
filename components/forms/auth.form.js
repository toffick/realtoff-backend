const BaseForm = require('./base.form');

class AuthForm extends BaseForm {

	/**
	 *
	 * @param {String} token
	 */
	constructor({ token }) {
		super();
		this.token = token;
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (!this.token) {
			this.addError('Authorization token can\'t be blank', 'token');
		}

		return this.isValid();

	}

}

module.exports = AuthForm;
