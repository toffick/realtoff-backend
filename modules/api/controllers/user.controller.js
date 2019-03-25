const _ = require('lodash');

const bluebird = require('bluebird');
const AuthForm = require('../../../components/forms/auth.form');
const SignUpForm = require('../../../components/forms/sign.up.form');
const SignInForm = require('../../../components/forms/sign.in.form');
const SignOutForm = require('../../../components/forms/sign.out.form');
const RefreshTokenFrom = require('../../../components/forms/refresh.jwt.token.form');

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
	}) {
		this.userTokenRepository = userTokenRepository;
		this.userRepository = userRepository;

		this.usersService = usersService;
		this.tokenGeneratorService = tokenGeneratorService;

		this.errorsHandler = errorsHandler;

		this.redisClient = bluebird.promisifyAll(redisConnection.getClient());
	}


	/**
	 *
	 * @param {Object} data
	 * @param {Function} next
	 * @return {Promise.<*>}
	 */
	async signUp(data, next) {

		const { email, password } = data.body;

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
	 * @param {Object} data
	 * @param {Function} next
	 * @return {Promise.<*>}
	 */
	async signIn(data, next) {

		try {

			const {
				email,
				password,
			} = data.body;


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
	async signOut(data, next) {

		const { access_token: accessToken, refresh_token: refreshToken } = data.body;

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
	async isAuth(data, next) {

		try {

			const { token } = data.req;

			const authForm = new AuthForm({ token });

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
	async refreshJwtTokens(data, next) {
		try {

			const { refresh_token: refreshToken } = data.body;

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
	async confirmEmail(data, next) {
		try {
			const { hash } = data.body;

			const user = await this.usersService.confirmUserEmail(hash);

			if (!user) {
				return next('User is not found!');
			}
			return next(null, {
				data: {
					confirmed: true,
				},
			});
		} catch (err) {
			const responseErrors = await this.errorsHandler.createUnknownError(err);
			return next(responseErrors);
		}
	}

}

module.exports = UserController;
