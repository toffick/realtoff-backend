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
			this.addError('Электронная почта обязательна', 'email');
		}

		if (!validator.isEmail(this.email, { allow_utf8_local_part: false })) {
			this.addError('Неверный формат электронной почты', 'email');
		} else if (this.email.length > 64) {
			this.addError('Электронная почта должна быть не больше 64 символов', 'email');
		} else {
			this.email = validator.normalizeEmail(this.email);
		}

		if (validator.isEmpty(this.password)) {
			this.addError('Пароль обязателен', 'password');
		}

		if (!validator.isLength(this.password, { min: PASSWORD_MIN_LENGTH })) {
			this.addError(`Пароль должен быть длинее ${PASSWORD_MIN_LENGTH} символов`, 'password');
		}

		if (this.hasErrors()) {
			return this.isValid();
		}

		const user = await this.userRepository.userExists(this.email);

		if (user) {
			this.addError('Аккаунт с такой электронной почтой уже существует', 'email');
		}

		return this.isValid();

	}

}

module.exports = SignUpForm;
