const _ = require('lodash');

const bluebird = require('bluebird');
const CreateOfferForm = require('../../../components/forms/create.offer.form');
const SearchForm = require('../../../components/forms/search.offer.form');
const CustomError = require('../../../components/errors/custom.error');

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

	async createOffer(req, res, next) {
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
		} = req.body;

		const { token } = req;
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

	async search(req, res, next) {
		try {
			const { query } = req;

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

	async _insertTestData(req, res, next) {
		try {
			const ress = await this.testInfoGenerator.insertTestData();
			return next(null, ress);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async getOffer(req, res, next) {
		try {
			const { id } = req.params;

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

	async isUserOfferOwner(req, res, next) {
		try {
			const { offerId } = req.params;
			const { token: { payload: { id: userId } } } = req;

			const offer = await this.offerService.findOffer(offerId);

			if (!offer || offer.user_id !== userId) {
				throw new CustomError('Forbidden', '', 403);
			}

			return next(null, true);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async savePhotos(req, res, next) {
		try {
			const { files } = req;
			const { offerId } = req.params;

			const photos = await this.offerService.uploadPhotos(files, offerId);

			return next(null, photos);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

}

module.exports = RealtyController;
