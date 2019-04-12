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

	/**
	 *
	 * @returns {Promise<*>}
	 */
	async getCountriesOfOpenOffers() {
		return this.dbConnection.sequelize.query(
			`select DISTINCT  country_code 
				from offer as o 
				join address as a
				on a.id = o.address_id
				where o.status = 'OPEN'
			`,
			{
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
			},
		);

	}

	/**
	 *
	 * @returns {Promise<*>}
	 */
	async getOfferCitiesByCountryCode(countryCode) {
		return this.dbConnection.sequelize.query(
			`select DISTINCT city 
				from offer as o 
				join address as a
				on a.id = o.address_id
				where o.status = 'OPEN' and a.country_code = :countryCode
			`,
			{
				replacements: {
					countryCode
				},
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
			},
		);

	}

}

module.exports = RealtyRepository;
