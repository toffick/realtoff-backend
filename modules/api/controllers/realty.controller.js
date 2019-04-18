const _ = require('lodash');

const bluebird = require('bluebird');
const CreateOfferForm = require('../../../components/forms/create.offer.form');
const SearchForm = require('../../../components/forms/search.offer.form');

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
	 * @param {SearchService} searchService
	 * @param {RedisConnection} redisConnection
	 */
	constructor({
					userRepository,
					errorsHandler,
					redisConnection,
					offerService,
					searchService,
					config,
					testInfoGenerator,
				}) {
		this.userRepository = userRepository;

		this.config = config;
		this.errorsHandler = errorsHandler;

		this.offerService = offerService;
		this.searchService = searchService;
		this.testInfoGenerator = testInfoGenerator;

		this.redisClient = bluebird.promisifyAll(redisConnection.getClient());
	}

	async createOffer(data, next) {
		const {
			address,
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
			additional_telephone_number: additionalTelephoneNumber,
			room_total: roomTotal,
			square_total: squareTotal,
			country_code: countryCode,
		} = data.body;

		const { token } = data.req;
		const { id } = token.payload;

		try {

			const createOfferForm = new CreateOfferForm({
				address,
				type,
				countryCode,
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
				additionalTelephoneNumber,
				roomTotal,
				squareTotal,
			});

			const isValid = await createOfferForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(createOfferForm.getErrors()));
			}

			const offer = await this.offerService.createOffer(createOfferForm.getFormObject(), id);

			return next(null, offer);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async search(data, next) {
		try {
			const { query } = data.req;

			const queryForm = new SearchForm(query);

			const isValid = await queryForm.validate();

			if (!isValid) {
				return next(this.errorsHandler.createValidateErrorsFromArray(queryForm.getErrors()));
			}

			const result = await this.searchService.findBy(queryForm.getFormObject());

			return next(null, result);

		} catch (e) {

			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async _insertTestData(data, next) {
		try {
			const res = await this.testInfoGenerator.insertTestData();
			return next(null, res);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async getOffer(data, next) {
		try {
			const { id } = data.params;

			let result;
			const offer = await this.offerService.findOffer(id);

			if (offer) {
				result = {
					success: true,
					result: offer
				};
			} else {
				result = {
					success: false,
					error: 'Объявление не найдено или было закрыто'
				};
			}

			return next(null, result);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

}

module.exports = RealtyController;
