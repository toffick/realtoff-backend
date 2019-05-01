const BaseForm = require('./base.form');
const { USER_STATUS } = require('../../constants/constants');
const validator = require('../validator');

class SignInForm extends BaseForm {


	/**
	 *
	 * @param {String} appId
	 * @param {String} email
	 * @param {String} password
	 * @param {UserRepository} userRepository
	 */
	constructor({
		email,
		password,
		userRepository,
	}) {
		super();

		this.email = validator.trim(email);
		this.password = validator.trim(password);

		this.userRepository = userRepository;

	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (validator.isEmpty(this.email)) {
			this.addError('Email is required', 'email');
		}

		if (!validator.isEmail(this.email, { allow_utf8_local_part: false })) {
			this.addError('Invalid email', 'email');
		} else {
			this.email = validator.normalizeEmail(this.email);
		}

		if (validator.isEmpty(this.password)) {
			this.addError('Password is required!', 'password');
		}

		if (this.hasErrors()) {
			return false;
		}

		const user = await this.userRepository.fetchActiveUserByEmail(this.email);

		if (!user) {
			this.addError('Неверные логин или пароль', '');
			return this.isValid();
		}

		if (user.status === USER_STATUS.BANNED) {
			this.addError('Пользователь заблокирован. По всем вопросам обращайтесь realtoffinfo@gmail.com', 'banned');
			return this.isValid();
		}

		const isValidPassword = await user.comparePassword(this.password);

		if (!isValidPassword) {
			this.addError('Неверные логин или пароль', '');
		}

		return this.isValid();

	}

}

module.exports = SignInForm;
