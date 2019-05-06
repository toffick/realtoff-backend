const BaseForm = require('./base.form');
const validator = require('../validator');

class PersonalInfoForm extends BaseForm {


	/**
	 *
	 * @param firstName
	 * @param secondName
	 * @param telephoneNumber
	 * @param isPersonalLessor
	 * @param {UserRepository} userRepository
	 */
	constructor({
		firstName,
		telephoneNumber,
		isPersonalLessor,
		userRepository,
		userId,
	}) {
		super();

		this.firstName = validator.trim(firstName);
		this.telephoneNumber = validator.trim(telephoneNumber);
		this.isPersonalLessor = !!isPersonalLessor;
		this.userId = userId;

		this.userRepository = userRepository;
	}

	/**
     *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (validator.isEmpty(this.firstName)) {
			this.addError('First name is required', 'first_name');
		}

		if (this.firstName.length > 255) {
			this.addError('Invalid firstName length', 'first_name');
		}

		if (validator.isEmpty(this.telephoneNumber)) {
			this.addError('telephoneNumber is required', 'telephone_number');
		}

		if (!validator.isMobilePhone(this.telephoneNumber)) {
			this.addError('invalid telephoneNumber', 'telephone_number');
		}

		const user = await this.userRepository.fetchUserById(this.userId);

		if (!user) {
			this.addError('Invalid email', '');
		}

		if (this.hasErrors()) {
			return false;
		}

		return this.isValid();

	}

}

module.exports = PersonalInfoForm;
