class DescriptionRepository {


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
	async createDescription(offerObject, { transaction } = { transaction: undefined }) {

		const description = await this.models.Description.create({
			floor_number: offerObject.floorNumber,
			floor_total: offerObject.floorTotal,
			room_total: offerObject.roomTotal,
			description: offerObject.description,
			permits_mask: offerObject.permitsMask,
			square_total: offerObject.squareTotal,
		}, { transaction });

		return description;
	}


}

module.exports = DescriptionRepository;
