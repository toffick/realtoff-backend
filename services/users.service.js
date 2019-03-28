const _ = require('lodash');
const NotFoundError = require('../components/errors/not.found.error');
const CustomError = require('../components/errors/custom.error');
const HashGeneratorHelper = require('../helpers/hash.generator.helper');

const { USER_ACCOUNT } = require('../components/events/event.bus').EVENTS;
const { TOKEN_TYPES, USER_PERMISSIONS } = require('../constants/constants');


class UsersService {


	/**
	 *
	 * @param {Object} config
	 * @param {TokenGeneratorService} tokenGeneratorService
	 * @param {UserRepository} userRepository
	 * @param {UserTokenRepository} userTokenRepository
	 * @param {SignOutTokenRepository} signOutTokenRepository
	 * @param {TemporaryRepository} temporaryRepository
	 * @param {EmailTransporter} emailTransporter
	 * @param {EmailTemplateRenderer} emailTemplateRenderer
	 * @param {EventBus} eventBus
	 */
	constructor({
		config,
		tokenGeneratorService,
		userRepository,
		userTokenRepository,
		signOutTokenRepository,
		temporaryRepository,
		emailTransporter,
		emailTemplateRenderer,
		eventBus,
		dbConnection,
	}) {
		this.config = config;

		this.tokenGeneratorService = tokenGeneratorService;

		this.userRepository = userRepository;
		this.userTokenRepository = userTokenRepository;
		this.signOutTokenRepository = signOutTokenRepository;
		this.temporaryRepository = temporaryRepository;

		this.emailTransporter = emailTransporter;
		this.emailTemplateRenderer = emailTemplateRenderer;

		this.eventBus = eventBus;
		this.dbConnection = dbConnection;
	}


	/**
	 *
	 * @param {String} email
	 * @param {String} password
	 * @return {Promise.<{user: *, access_token: String, refresh_token: String}>}
	 */
	async createUser(email, password, nickname) {

		const confirmHash = await this.tokenGeneratorService.generateRandomToken();

		const user = await this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {
			const newUser = await this.userRepository.createUser(email, password, nickname, { transaction });
			// await this.userEmailRepository.createUserEmailData(newUser.id, email, emailNormalize, confirmHash, { transaction });

			return newUser;
		});

		const url = this.config.EMAIL_SETTINGS.CONFIRM_EMAIL_URL + confirmHash;

		const html = await this.emailTemplateRenderer.render('emails/email_confirmation', {
			email,
			path_to_public: this.config.EMAIL_SETTINGS.URL_PATH_TO_PUBLIC,
			contact_email: this.config.EMAIL_SETTINGS.CONTACT_EMAIL,
			url,
		});

		// TODO EMAIL
		// await this.emailTransporter.sendMail({
		// 	to: email,
		// 	subject: 'Email confirmation',
		// 	html,
		// });

		const userResponse = await this.createTokens(user);

		return userResponse;
	}

	/**
	 *
	 * @param userId
	 * @param firstName
	 * @param telephoneNumber
	 * @param isPersonalLessor
	 * @returns {Promise<void>}
	 */
	async setPersonalInfo(userId, firstName, telephoneNumber, isPersonalLessor) {
		const [result] = await this.userRepository.updateUserPersonalInfo(userId, firstName, telephoneNumber, isPersonalLessor);

		if (!result) {
			throw new NotFoundError('Not Found', 'user_id');
		}

		return result === 1;
	}

	/**
	 *
	 * @param {Number} userId
	 * @return {Promise.<Model>}
	 */
	async getActiveUserForPublicById(userId) {

		const user = await this.userRepository.fetchUserById(userId);

		if (!user) {
			throw new NotFoundError('Not Found', 'user_id');
		}
		return {
			user: this._convertUserPublicField(user),
			access_token: null,
			refresh_token: null,
		};

	}


	/**
	 *
	 * @param {AccessToken} token
	 * @return {Promise.<{user: *}>}
	 */
	async authUser(token) {

		const isSignOutUser = await this.isSignOutUser(token.getRawToken());

		if (isSignOutUser) {
			throw new NotFoundError('Not Found', 'token');
		}

		const user = await this.userRepository.fetchUserById(token.getUserId());

		if (!user) {
			throw new NotFoundError('Not Found', 'user_id');
		}

		return {
			user: this._convertUserPublicField(user),
			access_token: null,
			refresh_token: null,
		};

	}


	/**
	 *
	 * @param {String} passwordHash
	 * @param {String} tfaToken
	 * @return {Promise.<{user: *, access_token: String, refresh_token: String}>}
	 */
	async tryToSignInUser({
							  email,
						  }) {
		if (email) {
			const user = await this.userRepository.fetchActiveUserByEmail(email);

			if (!user) {
				throw new NotFoundError('Not Found', 'user');
			}

			return this.createTokens(user);

		}

		return null;
	}


	/**
	 *
	 * @param {String} refreshToken
	 * @param {String} accessToken
	 * @return {Promise.<{result: boolean}>}
	 */
	async signOutUser({ refreshToken, accessToken }) {
		const promises = [];

		if (this.tokenGeneratorService.isValidToken(accessToken, TOKEN_TYPES.ACCESS)) {
			promises.push(this.signOutTokenRepository.addSignOutToken(accessToken));
		} else {
			promises.push(true);
		}

		promises.push(refreshToken ? this.userTokenRepository.removeUserToken(refreshToken) : true);

		const results = await Promise.all(promises);

		return {
			result: !!(results[0] && results[1]),
		};
	}


	/**
	 *
	 * @param {String} refreshToken
	 * @param {String} accessToken
	 * @param {Object} responseUser
	 * @return {Promise.<{user: *, access_token: String, refresh_token: String}>}
	 * @private
	 */
	async _getResponseUserObject(refreshToken, accessToken, responseUser) {
		const user = { ...responseUser };

		delete responseUser.password_hash;

		return {
			user,
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}


	/**
	 *
	 * @param user
	 * @return {Object}
	 * @private
	 */
	_convertUserPublicField(user) {
		const responseUser = user.toJSON();
		delete responseUser.password_hash;

		return responseUser;

	}


	/**
	 *
	 * @param {String} accessToken
	 * @return {Promise.<boolean>}
	 */
	async isSignOutUser(accessToken) {

		if (!accessToken) {
			return false;
		}

		const isSignOutToken = await this.signOutTokenRepository.isSignOutToken(accessToken);

		return isSignOutToken;

	}

	/**
	 * @param {Object} user
	 * @return {Promise.<{user: *, access_token: String, refresh_token: String}>}
	 */
	async createTokens(user) {
		const responseUser = this._convertUserPublicField(user);
		const { accessToken, refreshToken } = await this.generateJwtTokens(responseUser);
		const { refresh_token: createdRefreshToken } = await this.userTokenRepository.createUserToken(user.id, refreshToken);

		return this._getResponseUserObject(createdRefreshToken, accessToken, responseUser);
	}


	/**
	 *
	 * @param {String} oldRrefreshToken
	 * @return {Promise.<{accessToken: String, refreshToken: String}>}
	 */
	async refreshJwtTokens(oldRrefreshToken) {

		const userToken = await this.userTokenRepository.fetchUserTokenByRefreshToken(oldRrefreshToken);

		if (!userToken) {
			throw new NotFoundError('Not Found', 'userToken');
		}

		const { user_id: userId, id: userTokenId } = userToken;

		const activeUser = await this.userRepository.fetchUserById(userId);

		if (!activeUser) {
			throw new NotFoundError('Not Found', 'user');
		}

		const {
			accessToken, refreshToken: newRefreshToken,
		} = await this.generateJwtTokens(activeUser);

		await this.userTokenRepository.updateUserRefreshToken(userTokenId, newRefreshToken);

		return {
			access_token: accessToken,
			refresh_token: newRefreshToken,
		};
	}


	/**
	 *
	 * @param {Object} responseUser
	 * @return {Promise.<{accessToken: String, refreshToken: String}>}
	 */
	async generateJwtTokens(responseUser) {

		const {
			accessTokenData,
			refreshTokenData,
		} = this._configureTokensData(responseUser.id, responseUser.role_id);

		const accessToken = await this.tokenGeneratorService.generateJwtToken({
			data: accessTokenData,
			expiresIn: '30m',
		});

		const refreshToken = await this.tokenGeneratorService.generateJwtToken({
			data: refreshTokenData,
			expiresIn: '182d',
		});

		return {
			accessToken,
			refreshToken,
		};

	}

	/**
	 *
	 * @param {String|Number} userId
	 * @param role
	 */
	_configureTokensData(userId, role) {
		const refreshTokenData = {
			id: userId,
			type: TOKEN_TYPES.REFRESH,
			role_id: role,
		};

		const accessTokenData = {
			id: userId,
			type: TOKEN_TYPES.ACCESS,
			role_id: role,
		};

		return {
			accessTokenData,
			refreshTokenData,
		};
	}

	/**
	 *
	 * @param {Number} userId
	 */
	async isUserEmailConfirmed(userId) {

		const user = await this.userRepository.fetchUserById(userId);

		let result = false;

		if (!user) {
			throw new NotFoundError('Not Found', 'user_id');
		}

		const { is_email_confirmed: isEmailConfirmed } = user;


		const { is_changed: isEmailChangeSubmitted, is_confirmed: isNewEmailConfirmed, new_email: newEmail } = userEmailInfo;

		if (isEmailConfirmed) {
			if ((isEmailChangeSubmitted && isNewEmailConfirmed) || !newEmail) {
				result = true;
			}
		}

		return result;
	}

}


module.exports = UsersService;
