const BaseForm = require('./base.form');
const { PASSWORD_MIN_LENGTH } = require('../../constants/constants');
const validator = require('../validator');


class SignUpForm extends BaseForm {


	/**
	 *
	 * @param {String} email
	 * @param {String} password
	 * @param {UserRepository} userRepository
	 */
	constructor({
		email, password, userRepository,
	}) {
		super();

		this.email = validator.trim(email);
		this.password = validator.trim(password);
		this.userRepository = userRepository;
	}

	async validate() {

		if (validator.isEmpty(this.email)) {
			this.addError('Email is required!', 'email');
		}

		if (!validator.isEmail(this.email, { allow_utf8_local_part: false })) {
			this.addError('Email is invalid', 'email');
		} else {

			if (this.email.length > 64) {
				this.addError('Email must be less than 65 characters', 'email');
			}

			this.email = validator.normalizeEmail(this.email);
		}

		if (validator.isEmpty(this.password)) {
			this.addError('Password is required!', 'password');
		}

		if (!validator.isLength(this.password, { min: PASSWORD_MIN_LENGTH })) {
			this.addError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`, 'password');
		}

		if (this.hasErrors()) {
			return this.isValid();
		}

		const user = await this.userRepository.userExists(this.email);

		if (user) {
			this.addError('Account with that email address already exists.', 'email');
		}

		return this.isValid();

	}

}

module.exports = SignUpForm;
