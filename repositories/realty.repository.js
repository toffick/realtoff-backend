class RealtyRepository {

	constructor({ dbConnection, config }) {
		this.dbConnection = dbConnection;
		this.models = dbConnection.models;
		this.Op = dbConnection.Sequelize.Op;
	}

	/**
	 *
	 * @param offerObject
	 * @param userId
	 * @param descriptionId
	 * @param addressId
	 * @returns {Promise<*>}
	 */
	async createOffer(offerObject, userId, descriptionId, addressId, { transaction } = { transaction: undefined }) {

		const offer = await this.models.Offer.create({
			user_id: userId,
			description_id: descriptionId,
			address_id: addressId,
			type: offerObject.type,
			additional_phone_number: offerObject.additionalTelephoneNumber,
			price_per_month: offerObject.pricePerMonth,
			currency: offerObject.currency,
		}, { transaction });

		return offer;
	}


}

module.exports = RealtyRepository;
