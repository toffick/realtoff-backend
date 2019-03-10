class UserService {

	/**
	 * @param {Object} opts
	 * @param {AppConfig} opts.config
	 * @param {UserRepository} opts.userRepository
	 */
	constructor(opts) {
		this.config = opts.config;
		this.userRepository = opts.userRepository;
		this.errors = {};
	}

}

module.exports = UserService;
