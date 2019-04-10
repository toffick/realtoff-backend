class AddressRepository {


	constructor({ dbConnection, config }) {
		this.dbConnection = dbConnection;
		this.models = dbConnection.models;
		this.Op = dbConnection.Sequelize.Op;
	}

	/**
	 *
	 * @param offerObject
	 * @returns {Promise<*>}
	 */
	async createAddress(offerObject, { transaction } = { transaction: undefined }) {
		const coordinates = {
			type: 'Point',
			coordinates: [
				offerObject.coordinates.latitudeBN.toString(),
				offerObject.coordinates.longitudeBN.toString(),
			],
		};

		const address = await this.models.Address.create({
			country_code: offerObject.countryCode,
			city: offerObject.city,
			street: offerObject.street,
			house_number: offerObject.houseNumber,
			coordinates,
		}, { transaction });

		return address;
	}


}

module.exports = AddressRepository;
