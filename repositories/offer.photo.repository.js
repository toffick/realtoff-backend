class OfferPhotoRepository {

	constructor({ dbConnection }) {
		this.models = dbConnection.models;
		this.dbConnection = dbConnection;
	}

	/**
	 *
	 * @param photos
	 * @param offerId
	 * @returns {Promise<Array<Model>>}
	 */
	bulkCreatePhotos(photos, offerId) {
		const objects = photos.map((photoName, i) => ({
			file_name: photoName,
			offer_id: offerId,
		}));

		return this.models.OfferPhoto.bulkCreate(objects, { raw: true, returning: true });
	}

}

module.exports = OfferPhotoRepository;
