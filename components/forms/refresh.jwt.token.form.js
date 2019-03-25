const BaseForm = require('./base.form');
const validator = require('../validator');

const { TOKEN_TYPES } = require('../../constants/constants');

class RefreshTokenForm extends BaseForm {

	/**
     *
     * @param {String} refreshToken
	 * @param {TokenGeneratorService} tokenGeneratorService
     */
	constructor({ refreshToken, tokenGeneratorService }) {
		super();

		this.refreshToken = validator.trim(refreshToken);
		this.tokenGeneratorService = tokenGeneratorService;
	}

	/**
     *
	 * @return {Promise.<*>}
	 */
	async validate() {
		if (validator.isEmpty(this.refreshToken)) {
			this.addError('Refresh token field can\'t be blank', 'refreshToken');
		}

		if (!this.tokenGeneratorService.isValidToken(this.refreshToken, TOKEN_TYPES.REFRESH)) {
			this.addError('Refresh token isn\'t valid', 'refreshToken');
		}

		return this.isValid();
	}

}

module.exports = RefreshTokenForm;
