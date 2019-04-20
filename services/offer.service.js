const iso = require('iso-3166-1');

const { EVENTS } = require('../components/events/event.bus');

class OfferService {

	/**
	 *
	 * @param config
	 * @param {offerRepository} offerRepository
	 * @param dbConnection
	 * @param {AddressRepository} addressRepository
	 * @param {EventBus} eventBus
	 * @param {DescriptionRepository} descriptionRepository
	 * @param {OfferPhotoRepository} offerPhotoRepository
	 */
	constructor({
					config,
					offerRepository,
					dbConnection,
					eventBus,
					addressRepository,
					descriptionRepository,
					offerPhotoRepository
				}) {
		this.dbConnection = dbConnection;
		this.config = config;
		this.offerRepository = offerRepository;
		this.addressRepository = addressRepository;
		this.descriptionRepository = descriptionRepository;
		this.offerPhotoRepository = offerPhotoRepository;
		this.eventBus = eventBus;
	}

	/**
	 *
	 * @param offerObject
	 * @param userId
	 * @returns {Promise<*>}
	 */
	async createOffer(offerObject, userId) {

		const offer = await this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {

			const { id: addressId } = await this.addressRepository.createAddress(offerObject, { transaction });
			const { id: descriptionId } = await this.descriptionRepository.createDescription(offerObject, { transaction });
			const offer = await this.offerRepository.createOffer(offerObject, userId, descriptionId, addressId, { transaction });

			return offer;
		});

		offerObject.userId = userId;
		this.eventBus.publishEvent(EVENTS.USER.NEW_OFFER, JSON.stringify({
			offerData: offerObject,
			offerId: offer.id
		}));

		return offer;
	}

	/**
	 *
	 * @param id
	 * @returns {Promise<Promise<*>|Promise<*|void>>}
	 */
	async findOffer(id) {

		const offer = await this.offerRepository.findOfferById(id);

		offer.OfferPhotos.forEach((item)=>{
			item.dataValues.full_path = `${this.config.PUBLIC_PATHS.IMAGES}/${item.file_name}`;
			return item;
		})

		return offer;

	}

	async uploadPhotos(photos, offerId) {
		const photoNames = photos.map(({ filename }) => filename);
		const createdPhotos = await this.offerPhotoRepository.bulkCreatePhotos(photoNames, offerId);

		// TODO
		const photosWithFullPaths = createdPhotos.map((item)=>{
			item.dataValues.full_path = `${this.config.PUBLIC_PATHS.IMAGES}/${item.file_name}`;
			return item;
		})

		return photosWithFullPaths;
	}

}

module.exports = OfferService;
