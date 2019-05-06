const BaseForm = require('./base.form');
const { USER_STATUS } = require('../../constants/constants');

class AuthForm extends BaseForm {

	/**
	 *
	 * @param {String} token
	 */
	constructor({ token, userRepository }) {
		super();
		this.token = token;

		this.userRepository = userRepository;
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (!this.token) {
			this.addError('Токен не валидный', 'token');
		}

		if (this.hasErrors()) {
			return false;
		}

		const { id } = this.token.payload;
		const user = await this.userRepository.fetchUserById(id);

		if (user && user.status === USER_STATUS.BANNED) {
			this.addError('Пользователь заблокирован. По всем вопросам обращайтесь realtoffinfo@gmail.com', 'banned');
		}

		return this.isValid();

	}

}

module.exports = AuthForm;
