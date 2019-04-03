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
	 * @returns {Promise<boolean>}
	 */
	async createOffer(offerObject, userId) {
		const coordinates = {
			type: 'Point',
			coordinates: [
				offerObject.coordinates.latitudeBN.toString(),
				offerObject.coordinates.longitudeBN.toString(),
			],
		};

		const offer = await this.models.Offer.create({
			user_id: userId,
			type: offerObject.type,
			city: offerObject.city,
			street: offerObject.street,
			house_number: offerObject.houseNumber,
			floor_number: offerObject.floorNumber,
			floor_total: offerObject.floorTotal,
			price_per_month: offerObject.pricePerMonth,
			currency: offerObject.currency,
			description: offerObject.description,
			permits_mask: offerObject.permitsMask,
			coordinates,
		});

		return offer;
	}


}

module.exports = RealtyRepository;
