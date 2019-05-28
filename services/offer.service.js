const path = require('path');
const fs = require('fs');

const { EVENTS } = require('../components/events/event.bus');

class OfferService {

	/**
	 *
	 * @param config
	 * @param {OfferRepository} offerRepository
	 * @param dbConnection
	 * @param {AddressRepository} addressRepository
	 * @param {EventBus} eventBus
	 * @param {DescriptionRepository} descriptionRepository
	 * @param {OfferPhotoRepository} offerPhotoRepository
	 * @param {SubwayRepository} subwayRepository
	 */
	constructor({
		config,
		offerRepository,
		dbConnection,
		eventBus,
		addressRepository,
		descriptionRepository,
		offerPhotoRepository,
		subwayRepository,
	}) {
		this.dbConnection = dbConnection;
		this.config = config;

		this.offerRepository = offerRepository;
		this.addressRepository = addressRepository;
		this.descriptionRepository = descriptionRepository;
		this.offerPhotoRepository = offerPhotoRepository;
		this.subwayRepository = subwayRepository;

		this.eventBus = eventBus;
	}

	/**
	 *
	 * @param offerObject
	 * @param userId
	 * @returns {Promise<*>}
	 */
	async createOffer(offerObject, userId) {

		let nearSubway = false;

		const offer = await this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {

			const { id: addressId } = await this.addressRepository.createAddress(offerObject, { transaction });
			const { id: descriptionId } = await this.descriptionRepository.createDescription(offerObject, { transaction });
			const offer = await this.offerRepository.createOffer(offerObject, userId, descriptionId, addressId, { transaction });

			const [, value] = await this.subwayRepository
				.insertImmediateSubwaysWithOffer(offerObject.coordinates, offerObject.countryCode, offerObject.city, offer.id, { transaction });

			nearSubway = !!value;

			return offer;
		});

		offerObject.userId = userId;
		offerObject.nearSubway = nearSubway;

		this.eventBus.publishEvent(EVENTS.USER.NEW_OFFER, JSON.stringify({
			offerData: offerObject,
			offerId: offer.id,
		}));

		return offer;
	}

	/**
	 *
	 * @param id
	 * @param isAdmin
	 * @returns {Promise<Promise<*>|Promise<*|void>>}
	 */
	async findOffer(id, isAdmin = false) {
		const offer = await this.offerRepository.findOfferById(id, isAdmin);

		return offer;
	}

	/**
	 *
	 * @param photos
	 * @param offerId
	 * @returns {Promise<*>}
	 */
	async uploadPhotos(photos, offerId) {
		return this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {
			const photoNames = photos
				.map(({ filename }) => ({
					destination: `${this.config.PUBLIC_PATHS.IMAGES}/${filename}`,
					photoName: filename,
				}));
			const createdPhotos = await this.offerPhotoRepository.bulkCreatePhotos(photoNames, offerId, transaction);
			const [previewPhoto] = createdPhotos;
			await this.offerRepository.setFirstPreviewImage(offerId, previewPhoto.id, transaction);
			return createdPhotos;
		});

	}

	/**
	 *
	 * @param offer
	 * @param photoId
	 * @returns {Promise<*>}
	 */
	async removePhotos(offer, photoId) {
		return this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {

			const { preview_photo_id: previewPhotoId, id: offerId } = offer;


			if (previewPhotoId === photoId) {
				await this.offerPhotoRepository.setNewPhotoId(previewPhotoId, offerId, { transaction });
			}

			const photo = await this.offerPhotoRepository.fetchById(photoId, { transaction });

			const { BASE, IMAGES } = this.config.PUBLIC_PATHS;
			let pathName = path.join(__dirname, '..', BASE, IMAGES, photo.file_name);

			// TODO for backward capability with UNIX system for heroku env
			pathName = `${this.config.environment === 'production' ? '.' : ''}${pathName}`;

			await new Promise((res, rej) => {
				fs.unlink(pathName, (err) => {
					if (err) {
						console.error(err);
						return rej(err);
					}

					return res();
				});
			});

			await this.offerPhotoRepository.remove(photoId, { transaction });

			return true;
		});

	}

	async close(offerId) {
		const result = await this.offerRepository.close(offerId);
		return result > 1;
	}

	async changeStatus(status, offerId) {
		const result = await this.offerRepository.changeStatus(status, offerId);
		return result.length > 0;
	}

}

module.exports = OfferService;
