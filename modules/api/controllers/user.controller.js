const _ = require('lodash');

const bluebird = require('bluebird');
const AuthForm = require('../../../components/forms/auth.form');
const SignUpForm = require('../../../components/forms/sign.up.form');
const PersonalInfoForm = require('../../../components/forms/personal.info.form');
const SignInForm = require('../../../components/forms/sign.in.form');
const SignOutForm = require('../../../components/forms/sign.out.form');
const RefreshTokenFrom = require('../../../components/forms/refresh.jwt.token.form');
const SearchForm = require('../../../components/forms/search.offer.form');
const CustomError = require('../../../components/errors/custom.error');

/**
 * A namespace.
 * @namespace api
 * @class UsersController
 */
class UserController {

	/**
	 *
	 * @param {UserTokenRepository} userTokenRepository
	 * @param {UserRepository} userRepository
	 * @param {UsersService} usersService
	 * @param {TokenGeneratorService} tokenGeneratorService
	 * @param {ErrorsHandler} errorsHandler
	 * @param {RedisConnection} redisConnection
	 * @param {AuthActionService} authActionService
	 */
	constructor({
					userTokenRepository,
					userRepository,
					usersService,
					tokenGeneratorService,
					errorsHandler,
					redisConnection,
					config,
				}) {
		this.userTokenRepository = userTokenRepository;
		this.userRepository = userRepository;

		this.usersService = usersService;
		this.tokenGeneratorService = tokenGeneratorService;
		this.config = config;
		this.errorsHandler = errorsHandler;

		this.redisClient = bluebird.promisifyAll(redisConnection.getClient());
	}


	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 * @return {Promise.<*>}
	 */
	async signUp(req, res, next) {

		const { email, password } = req.body;

		try {

			const signUpForm = new SignUpForm({
				email,
				password,
				userRepository: this.userRepository,
			});

			const isValid = await signUpForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(signUpForm.getErrors()));
			}

			const userResponse = await this.usersService.createUser(
				signUpForm.email,
				signUpForm.password,
			);

			return next(null, userResponse);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}

	}

	/**
	 *
	 * @param data
	 * @param next
	 * @returns {Promise<void>}
	 */
	async setPersonalInfo(req, res, next) {
		const {
			first_name: firstName,
			telephone_number: telephoneNumber,
			is_personal_lessor: isPersonalLessor,
		} = req.body;

		const { token } = req;
		const { id } = token.payload;

		try {

			const setPersonalInfoForm = new PersonalInfoForm({
				firstName,
				telephoneNumber,
				isPersonalLessor,
				userId: id,
				userRepository: this.userRepository,
			});

			const isValid = await setPersonalInfoForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(setPersonalInfoForm.getErrors()));
			}

			const userResponse = await this.usersService.setPersonalInfo(
				id,
				setPersonalInfoForm.firstName,
				setPersonalInfoForm.telephoneNumber,
				setPersonalInfoForm.isPersonalLessor,
			);

			return next(null, userResponse);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 * @return {Promise.<*>}
	 */
	async signIn(req, res, next) {

		try {

			const {
				email,
				password,
			} = req.body;


			const signInForm = new SignInForm({
				email,
				password,
				userRepository: this.userRepository,
			});

			const isValid = await signInForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(signInForm.getErrors()));
			}

			const userResponse = await this.usersService.tryToSignInUser({
				email: signInForm.email,
			});

			if (!userResponse) {
				const responseErrors = this.errorsHandler
					.createValidateErrorsFromText('Bad request', '', 400);
				return next(responseErrors);
			}

			return next(null, userResponse);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}


	/**
	 *
	 * @param {Object} data
	 * @param next
	 * @return {Promise.<*>}
	 */
	async signOut(req, res, next) {

		const { access_token: accessToken, refresh_token: refreshToken } = req.body;

		try {

			const signOutForm = new SignOutForm({
				accessToken,
				refreshToken,
				userTokenRepository: this.userTokenRepository,
			});

			const isValid = await signOutForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(signOutForm.getErrors()));
			}

			const userResponse = await this.usersService.signOutUser({
				refreshToken: signOutForm.refreshToken,
				accessToken: signOutForm.accessToken,
			});

			return next(null, userResponse);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}


	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 */
	async isAuth(req, res, next) {

		try {

			const { token } = req;

			const authForm = new AuthForm({
				token,
				userRepository: this.userRepository,
			});

			const isValid = await authForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(authForm.getErrors()));
			}

			const userResponse = await this.usersService.authUser(authForm.token);

			return next(null, userResponse);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}

	}


	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 */
	async refreshJwtTokens(req, res, next) {
		try {

			const { refresh_token: refreshToken } = req.body;

			const refreshTokenForm = new RefreshTokenFrom({
				refreshToken,
				tokenGeneratorService: this.tokenGeneratorService,
			});

			const isValid = await refreshTokenForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(refreshTokenForm.getErrors()));
			}

			const refreshJwtTokensResponse = await this.usersService.refreshJwtTokens(refreshToken);

			return next(null, refreshJwtTokensResponse);

		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);

			return next(responseErrors);
		}
	}

	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 */
	async confirmEmail(req, res, next) {
		try {
			const { hash } = req.query;

			const updateInfo = await this.userRepository.confirmUserEmail(hash);

			if (!updateInfo) {
				return next('Invalid link!');
			}

			const { FINISH_REGISTRATION: path } = this.config.PUBLIC_URI_PATHS;

			return next(null, {
				redirect: {
					path,
				},
			});
		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);
			return next(responseErrors);
		}
	}

	/**
	 *
	 * @param data
	 * @param next
	 * @returns {Promise<*>}
	 */
	async saveFilters(req, res, next) {
		try {

			const { token, body } = req;
			const { id } = token.payload;

			const searchForm = new SearchForm(body);

			const isValid = await searchForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(searchForm.getErrors()));
			}

			const savedFilter = await this.usersService.saveFilter(searchForm.getFormObject(), id);

			return next(null, savedFilter);

		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);

			return next(responseErrors);
		}
	}

	async removeFilter(req, res, next) {
		try {

			const { token, params } = req;
			const { id } = token.payload;
			const { filterId } = params;

			const removedItems = await this.usersService.removeFilter(id, filterId);

			if (removedItems < 1) {
				throw new CustomError('Фильтра не существует', '', 404);
			}

			return next(null, true);

		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);

			return next(responseErrors);
		}
	}


	async getProfile(req, res, next) {
		try {

			const { token } = req;
			const { id } = token.payload;

			const profile = await this.usersService.getUserProfile(id);

			if (!profile) {
				throw new CustomError('Пользователя не существует', '', 404);
			}

			return next(null, profile);

		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);

			return next(responseErrors);
		}
	}

}

module.exports = UserController;
