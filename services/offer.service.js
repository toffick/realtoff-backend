const iso = require('iso-3166-1');

class OfferService {

	/**
	 *
	 * @param config
	 * @param {offerRepository} offerRepository
	 * @param dbConnection
	 * @param {AddressRepository} addressRepository
	 * @param {DescriptionRepository} descriptionRepository
	 */
	constructor({
		config, offerRepository, dbConnection, addressRepository, descriptionRepository,
	}) {
		this.dbConnection = dbConnection;
		this.config = config;
		this.offerRepository = offerRepository;
		this.addressRepository = addressRepository;
		this.descriptionRepository = descriptionRepository;
	}

	/**
	 *
 	 * @param offerObject
	 * @param userId
	 * @returns {Promise<*>}
	 */
	async createOffer(offerObject, userId) {

		const offer = await this.dbConnection.sequelize.transaction({
			isolationLevel: this.dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		}, async (transaction) => {

			const { id: addressId } = await this.addressRepository.createAddress(offerObject, { transaction });
			const { id: descriptionId } = await this.descriptionRepository.createDescription(offerObject, { transaction });
			const offer = await this.offerRepository.createOffer(offerObject, userId, descriptionId, addressId, { transaction });

			return offer;
		});


		return offer;
	}

	/**
	 * get all available countries that is been using in OPEN offers
	 * @returns {Promise<*>}
	 */
	async getOfferCountries() {
		const coutryCodes = await this.offerRepository.getCountriesOfOpenOffers();
		const countries = coutryCodes.map((countryCodeObj) => {
			const { country_code: countryCode } = countryCodeObj;
			const country = iso.whereAlpha2(countryCode);

			delete country.numeric;
			delete country.alpha3;
			return { country: country.country, code: country.alpha2 };
		});

		return countries;
	}

	/**
	 * get all available cities by countryCode that is been using in OPEN offers
	 * @param countyCode
	 * @returns {Promise<*>}
	 */
	async getOfferCitiesByCountryCode(countyCode) {
		const cities = await this.offerRepository.getOfferCitiesByCountryCode(countyCode);
		return cities.map(({ city }) => city);
	}

}

module.exports = OfferService;
