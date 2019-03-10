const BaseController = require('./abstracts/base.controller');

/**
 * A namespace.
 * @namespace api
 * @class UserController
 */
class UserController extends BaseController {

	/**
	 * @param {Object} opts
	 * @param {ExpandService} opts.expandService
	 * @param {AuthForm} opts.authForm
	 */
	constructor(opts) {
		super();
		this.expandService = opts.expandService;
		this.authForm = opts.authForm;
	}


	init(addRestHandler) {
		/** @name route-get-logged-user */
		addRestHandler(
			'get',
			'/api/v1/user',
			this.authForm.onlyLogged,
			this.getCurrentUser.bind(this),
		);
	}

	/**
	 * @api {get} /api/v1/user Get logged user
	 * @apiName GetLoggedUser
	 * @apiGroup User
	 * @apiVersion 0.1.0
	 */

	/**
	 * @see route-get-logged-user
	 * @param {UserDocument} user
	 * @return {Object}
	 */
	getCurrentUser({ user }) {
		return this.expandService.user(user);
	}

}

module.exports = UserController;
