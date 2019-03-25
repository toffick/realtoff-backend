const validator = require('../validator');
const BaseForm = require('./base.form');

class SignOutForm extends BaseForm {

	/**
	 *
	 * @param {String} refreshToken
	 * @param {String} accessToken
	 * @param {UserTokenRepository} userTokenRepository
	 */
	constructor({ refreshToken, accessToken, userTokenRepository }) {
		super();
		this.refreshToken = validator.trim(refreshToken);
		this.accessToken = validator.trim(accessToken);
		this.userTokenRepository = userTokenRepository;

	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (validator.isEmpty(this.refreshToken)) {
			this.addError('refresh_token field can\'t be blank', 'refresh_token');
		}

		if (validator.isEmpty(this.accessToken)) {
			this.addError('access_token field can\'t be blank', 'access_token');
		}

		/*
		if (this.hasErrors()) {
			return this.isValid();
		}

		const userToken = await this.userTokenRepository.fetchUserTokenByRefreshToken(this.refreshToken);

		if (!userToken) {
			this.addError('Invalid Refresh token', 'refresh_token');
			return this.isValid();
		}
		*/

		return this.isValid();

	}

}

module.exports = SignOutForm;
