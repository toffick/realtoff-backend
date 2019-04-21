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
	bulkCreatePhotos(photos, offerId, { transaction } = { transaction: undefined }) {
		const objects = photos.map(({photoName, destination}) => ({
			file_name: photoName,
			offer_id: offerId,
			destination,
		}));

		return this.models.OfferPhoto.bulkCreate(objects, { raw: true, returning: true, transaction });
	}

}

module.exports = OfferPhotoRepository;
