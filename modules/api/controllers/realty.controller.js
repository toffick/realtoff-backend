const _ = require('lodash');

const bluebird = require('bluebird');
const CreateOfferForm = require('../../../components/forms/create.offer.form');
const SearchForm = require('../../../components/forms/search.offer.form');
const CustomError = require('../../../components/errors/custom.error');
const { OFFER_STATUS } = require('../../../constants/constants');

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
	}) {
		this.userRepository = userRepository;

		this.config = config;
		this.errorsHandler = errorsHandler;

		this.offerService = offerService;
		this.searchService = searchService;

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

	async getOffer(req, res, next) {
		try {
			const { offerId } = req.params;

			if (Number.isNaN(offerId)) {
				throw new CustomError('Невалидный идентификатор объевления', '', 400);
			}

			let result;
			const offer = await this.offerService.findOffer(offerId);

			if (offer) {
				result = {
					success: true,
					result: offer,
				};
			} else {
				result = {
					success: false,
					error: 'Объявление не найдено или было закрыто',
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

			if (isNaN(offerId)) {
				throw new CustomError('Wrong data', '', 400);
			}

			const offer = await this.offerService.findOffer(offerId);

			if (!offer || offer.user_id !== userId || /*TODO why here?*/offer.status !== OFFER_STATUS.OPEN) {
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

			if (!files.length){
				throw new CustomError('Нет прикрепленных материалов', '', 400);
			}

			const photos = await this.offerService.uploadPhotos(files, offerId);

			return next(null, photos);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async removePhotos(req, res, next) {
		try {
			const { token: { payload: { id: userId } } } = req;
			const { offerId } = req.params;
			const { photoId } = req.query;

			if (isNaN(offerId) || isNaN(photoId)) {
				throw new CustomError('Wrong data', '', 400);
			}

			const offer = await this.offerService.findOffer(offerId);


			if (!offer || offer.user_id !== userId ) {
				throw new CustomError('Forbidden', '', 403);
			}

			const photos = await this.offerService.removePhotos(offer, Number(photoId));

			return next(null, photos);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

	async closeOffer(req, res, next) {
		try {
			const { offerId } = req.params;

			if (isNaN(offerId)) {
				throw new CustomError('Wrong data', '', 400);
			}

			const result = await this.offerService.close(offerId);

			if (result) {
				throw new CustomError('Такого объявления нет, либо оно уже закрыто', '', 404);
			}

			return next(null, result);
		} catch (e) {
			const responseErrors = await this.errorsHandler.createUnknownError(e);

			return next(responseErrors);
		}
	}

}

module.exports = RealtyController;
