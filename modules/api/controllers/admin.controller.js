const _ = require('lodash');

const bluebird = require('bluebird');
const CustomError = require('../../../components/errors/custom.error');
const { OFFER_STATUS, USER_STATUS } = require('../../../constants/constants');

/**
 * A namespace.
 * @namespace api
 * @class UsersController
 */
class AdminController {

	/**
	 *
	 * @param {UserTokenRepository} userTokenRepository
	 * @param {UserRepository} userRepository
	 * @param {OfferService} offerService
	 * @param {TokenGeneratorService} tokenGeneratorService
	 * @param {ErrorsHandler} errorsHandler
	 * @param {RedisConnection} redisConnection
	 * @param {UsersService} usersService
	 */
	constructor({
		userTokenRepository,
		userRepository,
		offerService,
		tokenGeneratorService,
		errorsHandler,
		redisConnection,
		usersService,
		config,
	}) {
		this.userTokenRepository = userTokenRepository;
		this.userRepository = userRepository;

		this.offerService = offerService;
		this.usersService = usersService;
		this.tokenGeneratorService = tokenGeneratorService;
		this.config = config;
		this.errorsHandler = errorsHandler;

		this.redisClient = bluebird.promisifyAll(redisConnection.getClient());
	}

	async changeOfferStatus(req, res, next) {
		try {
			const { params, body } = req;
			const { offerId } = params;
			const { status } = body;

			if (!OFFER_STATUS[status]) {
				throw new CustomError('Неизвестный статус', '', 400);
			}

			const success = await this.offerService.changeStatus(status, offerId);

			return next(null, success);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async getOffer(req, res, next) {
		try {
			const { offerId } = req.params;

			const offer = await this.offerService.findOffer(offerId, true);

			const result = {
				success: true,
				result: offer,
			};

			return next(null, result);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async changeUserStatus(req, res, next) {
		try {
			const { params, body } = req;
			const { userId } = params;
			const { status } = body;

			if (!USER_STATUS[status]) {
				throw new CustomError('Неизвестный статус', '', 400);
			}

			const success = await this.usersService.changeStatus(status, userId);

			return next(null, success);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

}

module.exports = AdminController;
