const BaseForm = require('./base.form');
const { PASSWORD_MIN_LENGTH } = require('../../constants/constants');
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
		userRepository
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

		if (!validator.isLength(this.password, { min: PASSWORD_MIN_LENGTH })) {
			this.addError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`, 'password');
		}

		if (this.hasErrors()) {
			return false;
		}

		const user = await this.userRepository.fetchActiveUserByEmail(this.email);

		if (!user) {
			this.addError('Invalid email or password', '');
			return this.isValid();
		}

		const isValidPassword = await user.comparePassword(this.password);

		if (!isValidPassword) {
			this.addError('Invalid email or password.', '');
		}

		return this.isValid();

	}

}

module.exports = SignInForm;
