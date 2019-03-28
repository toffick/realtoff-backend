class UserRepository {


	constructor({ dbConnection, config }) {
		this.dbConnection = dbConnection;
		this.models = dbConnection.models;
		this.Op = dbConnection.Sequelize.Op;
	}

	/**
	 *
	 * @param {String} emailNormalize
	 */
	async userExists(emailNormalize) {
		const user = await this.models.User.findOne({ where: { email: emailNormalize } });
		return !!user;
	}

	/**
	 *
	 * @param {String} email
	 * @param {String} emailNormalize
	 * @param {String} password
	 * @param {String} nickname
	 * @return {Promise.<*>}
	 */
	async createUser(email, password, nickname, { transaction } = { transaction: undefined }) {

		const user = await this.models.User.create({
			email,
			password,
			password_hash: password,
			second_name: nickname,
		}, { transaction });

		return user;
	}

	/**
	 *
	 * @param {Number} userId
	 * @return {Promise.<Model>}
	 */
	async fetchUserById(userId, { transaction } = { transaction: undefined }) {

		const user = await this.models.User.findOne({
			where: {
				id: userId,
			},
			transaction,
		});

		return user;
	}

	/**
	 *
	 * @param {String} email
	 * @return {Promise.<Model>}
	 */
	async fetchActiveUserByEmail(email) {

		const user = await this.models.User.findOne({
			where: {
				email,
			},
		});

		return user;
	}

	/**
	 *
	 * @param userId
	 * @param firstName
	 * @param telephoneNumber
	 * @param isPersonalLessor
	 * @returns {Promise<*>}
	 */
	async updateUserPersonalInfo(userId, firstName, telephoneNumber, isPersonalLessor) {

		const user = await this.models.User.update(
			{
				first_name: firstName,
				telephone_number: telephoneNumber,
				is_personal_lessor: isPersonalLessor,
			},
			{
				where: {
					id: userId,
				},
			},
		);

		return user;
	}


	async findByNameAndPassword(email, password, { transaction } = { transaction: undefined }) {
		return this.models.User.findOne({
			where: {
				email,
				password,
			},
			transaction,
		});
	}

}

module.exports = UserRepository;
