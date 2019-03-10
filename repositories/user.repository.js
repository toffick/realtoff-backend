const bcrypt = require('bcrypt');
const model = require('../models/user.model');
const BaseMongoRepository = require('./abstracts/base-mongo.repository');

class UserRepository extends BaseMongoRepository {

	/** @param {{ravenHelper:RavenHelper}} opts */
	constructor(opts) {
		super(opts.ravenHelper, model);
		this.errors = {
			NOT_FOUND: 'USER_NOT_FOUND',
			INVALID_PASSWORD: 'INVALID_PASSWORD',
			NOT_ACCEPTABLE: 'NOT_ACCEPTABLE',
		};
	}

	/**
	 * <h1>@private</h1>
	 * <h1>@friendly {@link UserService}</h1>
	 * for creation use only {@link UserService}<hr/>
	 * @inheritDoc BaseMongoRepository#create
	 * @return {Promise<UserDocument|[UserDocument]>}
	 */
	create(props) {
		return super.create(props);
	}

	/**
	 * @param {String} name
	 * @return {Promise<UserDocument>}
	 */
	findByName(name) {
		return this.findOne({ name });
	}

	/**
	 * @param {String} key
	 * @return {Promise<UserDocument>}
	 */
	findByKey(key) {
		return this.findOne({ key });
	}

	/**
	 * @inheritDoc BaseMongoRepository#findOne
	 * @return {Promise<UserDocument>}
	 */
	findOne(...args) {
		return super.findOne(...args);
	}

	/**
	 * @param {String} name
	 * @param {String} password
	 * @return {Promise<UserDocument>}
	 * @throws `NOT_FOUND`
	 * @throws `INVALID_PASSWORD`
	 * @throws `CAN_NOT_ACT_WITH_JIRA_USERS` if user has no access to PPF platform
	 */
	async findByNameAndPassword(name, password) {
		const user = await this.findOne({ name });
		if (!user) throw new Error(this.errors.NOT_FOUND);
		if (!user.password) throw new Error(this.errors.NOT_ACCEPTABLE);
		if (!bcrypt.compareSync(password, user.password)) throw new Error(this.errors.INVALID_PASSWORD);
		return user;
	}

	/**
	 * @inheritDoc BaseMongoRepository#findById
	 * @returns {Promise<UserDocument>}
	 */
	findById(...args) {
		return super.findById(...args);
	}

	/**
	 *
	 * @inheritDoc BaseMongoRepository#aggregate
	 * @returns {Promise<Array<>>}
	 */
	aggregate(...args) {
		return super.aggregate(...args);
	}

}

module.exports = UserRepository;
