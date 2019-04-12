class SearchService {

	/**
	 *
	 * @param config
	 * @param {RealtyRepository} realtyRepository
	 * @param dbConnection
	 * @param {AddressRepository} addressRepository
	 * @param {DescriptionRepository} descriptionRepository
	 * @param {CurrenciesRatesService} currenciesRatesService
	 */
	constructor({
		config, realtyRepository, dbConnection, addressRepository, descriptionRepository,
		currenciesRatesService,
	}) {
		this.dbConnection = dbConnection;
		this.config = config;

		this.realtyRepository = realtyRepository;
		this.addressRepository = addressRepository;
		this.descriptionRepository = descriptionRepository;

		this.currenciesRatesService = currenciesRatesService;
	}

	/**
	 *
	 * @param queryObject
	 * @returns {Promise<void>}
	 */
	async findBy(queryObject){
		return queryObject;
	}

	/**
	 *
	 * @param {MetaSearch} queryObject
	 * @private
	 */
	queryBuilder(queryObject){

	}


}

module.exports = SearchService;
