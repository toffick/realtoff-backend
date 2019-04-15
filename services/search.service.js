class SearchService {

	/**
	 *
	 * @param config
	 * @param {offerRepository} offerRepository
	 * @param {CurrenciesRatesService} currenciesRatesService
	 */
	constructor({
		config, offerRepository, currenciesRatesService,
	}) {
		this.config = config;

		this.offerRepository = offerRepository;

		this.currenciesRatesService = currenciesRatesService;
	}

	/**
	 *
	 * @param queryObject
	 * @returns {Promise<void>}
	 */
	async findBy(queryObject) {
		const currentCurrenciesRates = this.currenciesRatesService.currencyRates;

		const result = await this.offerRepository.findByQueryObject(queryObject, currentCurrenciesRates);

		return result;
	}


}

module.exports = SearchService;
