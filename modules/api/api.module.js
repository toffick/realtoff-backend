const logger = require('log4js').getLogger('api.module.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const MethodNotAllowedError = require('../../errors/method-not-allowed.error');
const RestError = require('../../errors/rest.error');
const FormError = require('../../errors/form.error');

/**
 * A namespace.
 * @namespace api
 * @class ApiModule
 */
class ApiModule {

	/**
	 *
	 * @param {{port, cors}} opts.config
	 * @param {RavenHelper} opts.ravenHelper
	 * @param {AuthController} opts.authController
	 * @param {UserController} opts.userController
	 */
	constructor(opts) {
		this.config = opts.config;
		this.ravenHelper = opts.ravenHelper;
		this.authController = opts.authController;
		this.userController = opts.userController;

		this.app = null;
		this.server = null;
	}

	/**
	 * Start HTTP server listener
	 * @return {Promise<void>}
	 */
	initModule() {
		return new Promise((resolve) => {
			logger.trace('Start HTTP server initialization');

			const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

			this.app = express();
			this.app.use(bodyParser.urlencoded({ extended: true }));
			this.app.use(bodyParser.json());
			this.app.use(express.static(path.resolve('public')));

			if (this.config.cors) {
				const corsOptions = {
					origin: (origin, callback) => {
						callback(null, true);
					},
					credentials: true,
					methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
					headers: ['x-user', 'X-Signature', 'accept', 'content-type'],
				};

				this.app.use(cors(corsOptions));
				this.app.options('*', cors());
			}

			this.app.use(session({
				name: 'crypto.sid',
				secret: this.config.session_secret,
				cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
				resave: false,
				saveUninitialized: false,
				rolling: true,
				store: sessionStore,
			}));
			this.app.use(passport.initialize());
			this.app.use(passport.session());

			this.app.use(express.static('templates/assets'));

			passport.serializeUser((user, done) => done(null, user));
			passport.deserializeUser((user, done) => done(null, user));

			this.server = this.app.listen(this.config.port, () => {
				logger.info(`API APP REST listen ${this.config.port} Port`);
				this._initRestRoutes();
				resolve();
			});
		});
	}

	/**
	 * Bind routers
	 */
	_initRestRoutes() {
		/** @type [BaseController] */
		const allControllers = [
			this.authController,
			this.userController,
		];
		allControllers.forEach((controller) => controller.init(this.addRestHandler.bind(this)));

		if (process.env.NODE_ENV === 'development') {
			this.app.use('/apidoc', express.static('apidoc'));
		}

		this.addRestHandler('get', '*', () => {
			throw new MethodNotAllowedError();
		});
	}

	/** @typedef {('json','file')} ResType */

	/** @typedef {('get','post','patch')} Method */

	/**
	 * @param {Method} method
	 * @param {ResType?} responseType
	 * @param {String} route
	 * @param args
	 */
	addRestHandler(method, responseType, route, ...args) {
		if (!['json', 'file'].includes(responseType)) {
			args.unshift(route);
			route = responseType;
			responseType = 'json';
		}
		const action = args.pop();
		this.app[method](route, async (req, res) => {
			try {
				args.forEach((handler) => handler()(req, res));
				req.form = req.form || { isValid: true };
				this.traceRequest(req, req.form);
				if (!req.form.isValid) { // noinspection ExceptionCaughtLocallyJS
					throw new FormError(req.form.getErrors());
				}
				const result = await action({ form: req.form, user: req.user, req });
				switch (responseType) {
					case 'json':
						return res.status(200).json({
							result: result || null,
							status: 200,
						});
					case 'file':
						return res.send(result);
					default:
						throw this.ravenHelper.error(new Error('unknown responseType'), 'api.module addRestHandler', {
							method, responseType, route,
						});
				}
			} catch (error) {
				let restError = error;
				if (!(error instanceof RestError)) {
					logger.error(error);
					restError = { status: 500, message: 'server side error' };
				}
				return res.status(restError.status).json({
					error: restError.details || restError.message,
					status: restError.status,
				});
			}
		});
	}

	traceRequest(req, form) {
		const traceForm = { ...form };
		['password'].forEach((hiddableField) => {
			if (form[hiddableField]) {
				traceForm[hiddableField] = form[hiddableField].replace(/./ig, '*');
			}
		});
		logger.trace(`${req.method.toUpperCase()} Request ${req.originalUrl}`, JSON.stringify(traceForm));
	}

	close() {
		this.server.close();
	}

}

module.exports = ApiModule;
