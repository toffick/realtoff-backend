const log4js = require('log4js');
const logger = require('log4js').getLogger('api.module.js');

logger.level = 'debug';

const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const RateLimiter = require('express-rate-limit');
const AccessToken = require('../../components/access.token');
const ResponseErrors = require('../../components/errors/response.errors');


/**
 * A namespace.
 * @namespace api
 * @class ApiModule
 */
class ApiModule {

	/**
	 *
	 * @param config
	 * @param {RealtyController} realtyController
	 * @param {UserController} userController
	 * @param {TokenGeneratorService} tokenGeneratorService
	 * @param {ErrorsHandler} errorsHandler
	 */
	constructor({
		config,
		realtyController,
		userController,
		tokenGeneratorService,
		errorsHandler,
	}) {
		this.config = config;
		this.userController = userController;
		this.realtyController = realtyController;
		this.errorsHandler = errorsHandler;
		this.tokenGeneratorService = tokenGeneratorService;

		this.app = null;
	}

	/**
	 * Start HTTP server listener
	 */
	initModule(options, next) {

		this.app = options.router;

		this.app.use(passport.initialize());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
		this.app.use(log4js.connectLogger(logger, { level: 'info' }));

		if (this.config.cors) {
			const corsOptions = {
				origin: (origin, callback) => {
					callback(null, true);
				},
				credentials: true,
				methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
				allowedHeaders: ['x-user', 'X-Signature', 'accept', 'content-type', 'Authorization', 'authorization'],
			};

			this.app.use(cors(corsOptions));
			this.app.options('*', cors());
		}

		const jwtOptions = {
			jwtFromRequest: ExtractJwt.versionOneCompatibility({}),
			secretOrKey: this.config.jwtsecret,
		};

		passport.use(new JwtStrategy(jwtOptions, ((payload, done) => done(null, payload))));

		this._setRateLimits();
		this._initRoutes();

		return next();

	}

	_setRateLimits() {

		// TODO delays
		const signUpLimiterOptions = {
			windowMs: 10 * 60 * 1000,
			max: 5,
			message: 'Too many attempts to sign up from this IP',
		};

		const signInLimiterOptions = {
			windowMs: 60 * 1000,
			max: 10,
			message: 'Too many attempts to sign in from this IP',
		};

		const signUpLimiter = new RateLimiter(this.configureLimiterOptions(signUpLimiterOptions));
		const signInLimiter = new RateLimiter(this.configureLimiterOptions(signInLimiterOptions));

		// this.app.use('/sign-up', signUpLimiter);
		// this.app.use('/sign-in', signInLimiter);

	}


	/**
	 * @description append default options and override handler
	 * @param {Object} rateLimiterOptions
	 * @param {Number} rateLimiterOptions.windowMs
	 * @param {Number} rateLimiterOptions.delayAfter
	 * @param {Number} rateLimiterOptions.delayMs
	 * @param {Number} rateLimiterOptions.max
	 * @param {String} rateLimiterOptions.message
	 * @returns {Object}
	 */
	configureLimiterOptions(rateLimiterOptions) {

		if (!rateLimiterOptions) {
			return false;
		}

		rateLimiterOptions.statusCode = 429;
		rateLimiterOptions.headers = 1;
		rateLimiterOptions.message = `${rateLimiterOptions.message}, please try again in ${Math.ceil(rateLimiterOptions.windowMs / 1000)} seconds`;

		const {
			headers,
			windowMs,
			message,
			statusCode,
		} = rateLimiterOptions;

		rateLimiterOptions.handler = (req, res) => {

			if (headers) {
				res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
			}

			this._sendError(res, message, statusCode);
		};

		return rateLimiterOptions;

	}

	/**
	 *
	 * @param {Object} req
	 * @param {Function} next
	 */
	isAuthenticated({ req }, next) {

		return passport.authenticate('jwt', { session: false }, (err, payload) => {

			if (err) {
				return next(err);
			}

			if (!payload || !payload.id) {
				return next(this.errorsHandler.createValidateErrorsFromText('Forbidden', '', 403));
			}

			req.token = new AccessToken(req.header('Authorization'), payload);

			const accessToken = req.token.getRawToken();

			return this.tokenGeneratorService.isValidToken(accessToken).then((isValidToken) => {

				if (!isValidToken) {
					return next(this.errorsHandler.createValidateErrorsFromText('Forbidden', '', 403));
				}

				return next();

			}).catch(() => next(this.errorsHandler.createValidateErrorsFromText('Forbidden', '', 403)));

		})(req);

	}

	_initRoutes() {

		this._addHandler('post', '/sign-up', this.userController.signUp.bind(this.userController));
		this._addHandler('post', '/sign-up/continue', this.isAuthenticated.bind(this), this.userController.setPersonalInfo.bind(this.userController));
		this._addHandler('post', '/sign-in', this.userController.signIn.bind(this.userController));
		this._addHandler('post', '/sign-out', this.userController.signOut.bind(this.userController));
		this._addHandler('post', '/auth', this.isAuthenticated.bind(this), this.userController.isAuth.bind(this.userController));
		this._addHandler('post', '/refresh-tokens', this.userController.refreshJwtTokens.bind(this.userController));
		this._addHandler('post', '/save-user-filters', this.isAuthenticated.bind(this), this.userController.saveFilters.bind(this.userController));
		this._addHandler('get', '/confirm-email', this.userController.confirmEmail.bind(this.userController));

		this._addHandler('post', '/create-offer', this.isAuthenticated.bind(this), this.realtyController.createOffer.bind(this.realtyController));
		this._addHandler('get', '/search-offers', this.realtyController.search.bind(this.realtyController));
		this._addHandler('get', '/offers/:id', this.realtyController.getOffer.bind(this.realtyController));

		if(this.config.environment !== 'production'){
			this._addHandler('get', '/insert-test-data', this.realtyController._insertTestData.bind(this.realtyController));
		}

		this.app.get('*', (req, res) => res.status(405).json({
			error: 'Method Not Allowed',
			status: 405,
		}));

		this.app.use((err, req, res, next) => {
			if (err.status && err.status !== 500) {
				return res.status(err.status).json({
					error: err,
					status: err.status,
				});
			}

			return next();
		});

	}

	_addHandler(...params) {

		const args = Array.prototype.slice.call(params);
		const type = args.splice(0, 1)[0];
		const url = args.splice(0, 1)[0];
		const decoratedFunctions = [];

		args.forEach((action, idx) => {

			decoratedFunctions.push((req, res, next) => action({
				req,
				query: req.query,
				params: req.params,
				body: req.body,
			}, (err, result) => {

				if (err) {

					if (err instanceof ResponseErrors) {
						return res.status(err.getCode()).json(err.getResponseErrors());
					}

					return res.status(500).json({ errors: [err] });
				}

				if (idx < args.length - 1) {
					return next();
				}

				if (result.redirect) {
					return res.redirect(308, result.redirect.path);
				}

				return res.status(200).json(result);

			}));

		});

		return this.app[type].apply(this.app, [url, ...decoratedFunctions]);

	}

	traceRequest(req, res, next) {
		const formForLog = Object.assign({}, req.body, req.query);

		if (formForLog.password) {
			formForLog.password = formForLog.password.replace(/./ig, '*');
		}
		if (formForLog.password_confirmation) {
			formForLog.password_confirmation = formForLog.password_confirmation.replace(/./ig, '*');
		}
		if (formForLog.current_password) {
			formForLog.current_password = formForLog.current_password.replace(/./ig, '*');
		}
		if (formForLog.new_password) {
			formForLog.new_password = formForLog.new_password.replace(/./ig, '*');
		}
		logger.trace(`${req.method.toUpperCase()} Request ${req.originalUrl}`, JSON.stringify(formForLog));
		next();
	}

	processActionMiddleware(action, req, res) {
		let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if (ip) ip = ip.replace(/,.*/, '');
		action({
			form: req.form,
			user: req.user,
			req,
			res,
			ip,
		}, (err, result) => {

			if (err) {
				return this._sendError(res, err, result);
			}

			return res.status(200).json(result);
		});
	}


	_sendError(res, message, status) {
		return res.status(status || 500).json({
			code: status || 500,
			errors: [
				{
					message,
					param: '',
				},
			],
		});
	}

}

module.exports = ApiModule;
