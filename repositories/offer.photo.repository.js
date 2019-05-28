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
	async bulkCreatePhotos(photos, offerId, { transaction } = { transaction: undefined }) {
		const objects = photos.map(({ photoName, destination }) => ({
			file_name: photoName,
			offer_id: offerId,
			destination,
		}));

		return this.models.OfferPhoto.bulkCreate(objects, { raw: true, returning: true, transaction });
	}

	/**
	 *
	 * @param photos
	 * @param photoId
	 * @param offerId
	 * @returns {Promise<Array<Model>>}
	 */
	async setNewPhotoId(photoId, offerId, { transaction } = { transaction: undefined }) {

		return this.dbConnection.sequelize.query(
			`
				update offer as o 
				set preview_photo_id = res.id
				from (select coalesce((select id from offer_photo 
										where offer_id=:offerId 
										and id <> :photoId
										 order by id 
										 limit 1), null) as id) as res
				where o.id = :offerId

			`,
			{
				replacements: {
					photoId,
					offerId,
				},
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
				raw: true,
				transaction
			},
		);
	}

	/**
	 *
	 * @param userId
	 * @returns {Promise<*|PromiseLike<boolean | never>|Promise<boolean | never>>}
	 * @param photoId
	 */
	async remove(photoId, { transaction } = { transaction: undefined }) {
		return this.models.OfferPhoto.destroy({
			where: {
				id: photoId,
			},
			transaction
		});

	}


	/**
	 *
	 * @param {Number} userId
	 * @return {Promise.<Model>}
	 */
		async fetchById(id, { transaction } = { transaction: undefined }) {

		const photo = await this.models.OfferPhoto.findOne({
			where: {
				id,
			},
			transaction,
		});

		return photo;
	}

}

module.exports = OfferPhotoRepository;
