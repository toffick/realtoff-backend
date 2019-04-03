const _ = require('lodash');

const bluebird = require('bluebird');
const CreateOfferForm = require('../../../components/forms/create.offer.form');

/**
 * A namespace.
 * @namespace api
 * @class UsersController
 */
class RealtyController {

	/**
	 *
	 * @param {UserTokenRepository} userTokenRepository
	 * @param {UserRepository} userRepository
	 * @param {ErrorsHandler} errorsHandler
	 * @param {OfferService} offerService
	 * @param {RedisConnection} redisConnection
	 */
	constructor({
		userRepository,
		errorsHandler,
		redisConnection,
		offerService,
		config,
	}) {
		this.userRepository = userRepository;

		this.config = config;
		this.errorsHandler = errorsHandler;

		this.offerService = offerService;

		this.redisClient = bluebird.promisifyAll(redisConnection.getClient());
	}

	async createOffer(data, next) {
		const {
			type,
			city,
			street,
			house_number: houseNumber,
			floor_number: floorNumber,
			floor_total: floorTotal,
			coordinates,
			price_per_month: pricePerMonth,
			currency,
			description,
			permits_mask: permitsMask,
		} = data.body;

		const { token } = data.req;
		const { id } = token.payload;

		try {

			const createOfferForm = new CreateOfferForm({
				type,
				city,
				street,
				houseNumber,
				floorNumber,
				floorTotal,
				coordinates,
				pricePerMonth,
				currency,
				description,
				permitsMask,
			});

			const isValid = await createOfferForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(createOfferForm.getErrors()));
			}

			const offer = this.offerService.createOffer(createOfferForm.getFormObject(), id);

			return next(null, { success: offer });

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}


}

module.exports = RealtyController;
