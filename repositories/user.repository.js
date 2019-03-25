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
	 * @return {Promise.<*>}
	 */
	async createUser(email, password, { transaction } = { transaction: undefined }) {

		const user = await this.models.User.create({
			email,
			password,
			password_hash: password,
		}, { transaction });

		return user;
	}

	/**
	 *
	 * @param {Number} userId
	 * @return {Promise.<Model>}
	 */
	async fetchActiveUserById(userId, { transaction } = { transaction: undefined }) {

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
	 * @param {String} emailNormalize
	 * @return {Promise.<Model>}
	 */
	async fetchActiveUserByNormalizeEmail(emailNormalize) {

		const user = await this.models.User.findOne({
			where: {
				email: emailNormalize,
			},
		});

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
