const BaseController = require('./abstracts/base.controller');
const RestError = require('../../../errors/rest.error');

/**
 * A namespace.
 * @namespace api
 * @class AuthController
 */
class AuthController extends BaseController {

	/**
	 * @param {Object} opts
	 * @param {RavenHelper} opts.ravenHelper
	 * @param {UserRepository} opts.userRepository
	 * @param {ExpandService} opts.expandService
	 * @param {AuthForm} opts.authForm
	 */
	constructor(opts) {
		super();
		this.ravenHelper = opts.ravenHelper;
		this.userRepository = opts.userRepository;
		this.expandService = opts.expandService;
		this.authForm = opts.authForm;
	}


	init(addRestHandler) {
		/** @name route-sign-in */
		addRestHandler(
			'post',
			'/api/v1/auth/sign-in',
			this.authForm.verifyAuthData,
			this.signIn.bind(this),
		);
		/** @name route-sign-out */
		addRestHandler(
			'get',
			'/api/v1/auth/sign-out',
			AuthController.signOut,
		);
	}

	/**
	 * @api {post} /api/v1/auth/sign-in Sign-In
	 * @apiName SignIn
	 * @apiGroup Auth
	 * @apiVersion 0.1.0
	 * @apiParam {String} name
	 * @apiParam {String} password
	 * @apiParamExample {json} Request-Example:
	 *    {
	 *        "name": "jamesBorne",
	 *        "password": "superSecretPassword",
	 *    }
	 * @apiError (422) InvalidCredentials name or password is invalid
	 */

	/**
	 * @see route-sign-in
	 * @param req
	 * @param {{name: String, password: String}} form
	 */
	async signIn({ req, form }) {
		try {
			console.log(form);
			const user = await this.userRepository.findByNameAndPassword(form.name, form.password);
			await this._login(req, user);
			return this.expandService.user(user);
		} catch (error) {
			if ([
				this.userRepository.errors.NOT_FOUND,
				this.userRepository.errors.INVALID_PASSWORD,
				this.userRepository.errors.NOT_ACCEPTABLE,
			].includes(error.message)) {
				throw new RestError('name or password is invalid', 422);
			}
			throw error;
		}
	}

	/**
	 * @api {post} /api/v1/auth/sign-out Sign-Out
	 * @apiName SignOut
	 * @apiGroup Auth
	 * @apiVersion 0.1.0
	 */

	/**
	 * @see route-sign-out
	 * @param {{ logOut:function() }} req
	 * @return {boolean}
	 */
	static signOut({ req }) {
		req.logOut();
		return true;
	}

	/**
	 * @param req
	 * @param {UserDocument} user
	 * @return {Promise<void>}
	 */
	_login(req, user) {
		return new Promise((resolve, reject) => {
			req.logIn(user, (err) => {
				if (err) return reject(this.ravenHelper.error(err, 'auth.controller _login'));
				return resolve();
			});
		});
	}

}

module.exports = AuthController;
