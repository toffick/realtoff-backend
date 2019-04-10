
class OfferService {

	/**
	 *
	 * @param config
	 * @param {RealtyRepository} realtyRepository
	 * @param dbConnection
	 * @param {AddressRepository} addressRepository
	 * @param {DescriptionRepository} descriptionRepository
	 */
	constructor({
		config, realtyRepository, dbConnection, addressRepository, descriptionRepository,
	}) {
		this.dbConnection = dbConnection;
		this.config = config;
		this.realtyRepository = realtyRepository;
		this.addressRepository = addressRepository;
		this.descriptionRepository = descriptionRepository;
	}

	/**
	 *
	 * @param offerObject
	 * @returns {Promise<void>}
	 */
	async createOffer(offerObject, userId) {

		const offer = await this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {

			const { id: addressId } = await this.addressRepository.createAddress(offerObject, { transaction });
			const { id: descriptionId } = await this.descriptionRepository.createDescription(offerObject, { transaction });
			const offer = await this.realtyRepository.createOffer(offerObject, userId, descriptionId, addressId, { transaction });

			return offer;
		});


		return offer;
	}

}

module.exports = OfferService;
