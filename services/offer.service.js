
class OfferService {

	/**
	 * @param {Object} config
	 * @param {RealtyRepository} realtyRepository
	 */
	constructor({ config, realtyRepository }) {
		this.config = config;
		this.realtyRepository = realtyRepository;
	}

	/**
	 *
	 * @param offerObject
	 * @returns {Promise<void>}
	 */
	async createOffer(offerObject, userId) {
		const offer = this.realtyRepository.createOffer(offerObject, userId)
	}

}

module.exports = OfferService;
