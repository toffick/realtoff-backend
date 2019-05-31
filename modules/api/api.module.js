/* eslint-disable linebreak-style,max-len */
const log4js = require('log4js');
const logger = require('log4js').getLogger('api.module.js');

logger.level = 'debug';

const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const RateLimiter = require('express-rate-limit');
const AccessToken = require('../../components/access.token');
const ResponseErrors = require('../../components/errors/response.errors');
const { USER_ROLES } = require('../../constants/constants');


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
	 * @param {AdminController} adminController
	 * @param {TokenGeneratorService} tokenGeneratorService
	 * @param {ErrorsHandler} errorsHandler
	 * @param {TemporaryRepository} temporaryRepository
	 */
	constructor({
		config,
		realtyController,
		userController,
		tokenGeneratorService,
		errorsHandler,
		adminController,
		temporaryRepository,
	}) {
		this.config = config;
		this.userController = userController;
		this.realtyController = realtyController;
		this.adminController = adminController;
		this.errorsHandler = errorsHandler;
		this.tokenGeneratorService = tokenGeneratorService;
		this.temporaryRepository = temporaryRepository;

		this.app = null;
		this.multerMiddlewareOffer = null;
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
			secretOrKey: this.config.JWT_SECRET,
		};

		passport.use(new JwtStrategy(jwtOptions, ((payload, done) => done(null, payload))));

		let imagesPublicPath = path.join(this.config.PUBLIC_PATHS.BASE, this.config.PUBLIC_PATHS.IMAGES);

		//TODO for backward capability with UNIX system for heroku env
		imagesPublicPath = `${this.config.environment === 'production' ? '.' : path.join(__dirname, '../..')}${imagesPublicPath}`;

		this.multerMiddlewareOffer = multer({
			storage: multer.diskStorage({
				destination: (req, file, callback) => {
					callback(null, imagesPublicPath);
				},
				filename: (req, file, callback) => {
					const fileName = `${req.params.offerId}-${Date.now()}${path.extname(file.originalname)}`;
					callback(null, fileName);
				},
			}),
			limits: { fileSize: 3145728 },
		});

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

	isAdmin(req, res, next) {
		const { payload } = req.token;

		if (payload.role !== USER_ROLES.ADMIN) {
			return next(this.errorsHandler.createValidateErrorsFromText('Forbidden', '', 403));
		}

		return next();
	}

	async isEmailConfirmed(req, res, next) {
		const { payload } = req.token;

		if (!payload.isEmailConfirmed) {
			const redisKey = `${this.temporaryRepository.KEYS.EMAIL_RECENTLY_CONFIRMED}:${payload.id}`;
			const result = await this.temporaryRepository.fetchData(redisKey);

			if (!result) {
				return next(this.errorsHandler.createValidateErrorsFromText('Forbidden', 'is_email_confirmed', 403));
			}
		}

		return next();
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Function} next
	 */
	isAuthenticated(req, res, next) {

		return passport.authenticate('jwt', { session: false }, async (err, payload) => {

			if (err) {
				return next(err);
			}

			if (!payload || !payload.id) {
				return next(this.errorsHandler.createValidateErrorsFromText('Forbidden', '', 403));
			}

			const redisKey = `${this.temporaryRepository.KEYS.BANNED_USER}:${payload.id}`;
			const isUserRecentryBanned = await this.temporaryRepository.fetchData(redisKey);

			if (isUserRecentryBanned) {
				return next(this.errorsHandler.
					createValidateErrorsFromText('Пользователь заблокирован. По всем вопросам обращайтесь realtoffinfo@gmail.com', 'banned', 403));
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

		/* -------------Public endpoints--------------*/
		this._addHandler('get', '/search-offers', this.realtyController.search.bind(this.realtyController));
		this._addHandler('get', '/offers/general/:offerId', this.realtyController.getOffer.bind(this.realtyController));
		this._addHandler('post', '/sign-up', this.userController.signUp.bind(this.userController));
		this._addHandler('post', '/sign-in', this.userController.signIn.bind(this.userController));
		this._addHandler('post', '/sign-out', this.userController.signOut.bind(this.userController));
		this._addHandler('post', '/refresh-tokens', this.userController.refreshJwtTokens.bind(this.userController));
		this._addHandler('get', '/confirm-email', this.userController.confirmEmail.bind(this.userController));

		/* -------------Auth onlyendpoints--------------*/
		this._addHandler('post', '/auth',
			this.isAuthenticated.bind(this),
			this.userController.isAuth.bind(this.userController));
		this._addHandler('post', '/user-filters',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.userController.saveFilters.bind(this.userController));
		this._addHandler('delete', '/user-filters/:filterId',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.userController.removeFilter.bind(this.userController));
		this._addHandler('get', '/profile',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.userController.getProfile.bind(this.userController));
		this._addHandler('post', '/offers',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.realtyController.createOffer.bind(this.realtyController));
		this._addHandler('post', '/sign-up/continue',
			this.isAuthenticated.bind(this),
			this.userController.setPersonalInfo.bind(this.userController));
		this._addHandler('put', '/offers/close/:offerId',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.realtyController.isUserOfferOwner.bind(this.realtyController),
			this.realtyController.closeOffer.bind(this.realtyController));
		this._addHandler('put', '/offers/photos/:offerId',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.realtyController.isUserOfferOwner.bind(this.realtyController),
			this.multerMiddlewareOffer.array('offer-image', 10).bind(this.multerMiddlewareOffer),
			this.realtyController.savePhotos.bind(this.realtyController));
		this._addHandler('delete', '/offers/photos/:offerId',
			this.isAuthenticated.bind(this),
			this.isEmailConfirmed.bind(this),
			this.realtyController.removePhotos.bind(this.realtyController));

		/* -------------Admin endpoints--------------*/
		this._addHandler('put', '/offers/change-status/:offerId', this.isAuthenticated.bind(this),
			this.isAdmin.bind(this),
			this.adminController.changeOfferStatus.bind(this.adminController));

		this._addHandler('get', '/offers/meta/:offerId', this.isAuthenticated.bind(this),
			this.isAdmin.bind(this),
			this.adminController.getOffer.bind(this.adminController));

		this._addHandler('put', '/users/change-status/:userId', this.isAuthenticated.bind(this),
			this.isAdmin.bind(this),
			this.adminController.changeUserStatus.bind(this.adminController));

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

			decoratedFunctions.push((req, res, next) => action(
				req,
				res,
				(err, result) => {

					if (err) {

						logger.error(err);
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

				},
			));

		});

		return this.app[type].apply(this.app, [url, ...decoratedFunctions]);

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
