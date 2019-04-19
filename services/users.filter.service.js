const _ = require('lodash');

class UsersFilterService {


	/**
	 *
	 * @param config
	 * @param eventBus
	 * @param {UserFilterRepository} userFilterRepository
	 * @param {CurrenciesRatesService} currenciesRatesService
	 */
	constructor({
		config,
		eventBus,
		userFilterRepository,
		currenciesRatesService,
	}) {
		this.config = config;

		this.userFilterRepository = userFilterRepository;

		this.currenciesRatesService = currenciesRatesService;
	}


	async getSubscribersEmails(offerData) {
		const currentCurrenciesRates = this.currenciesRatesService.currencyRates;

		return this.userFilterRepository.findSubscribersByOfferInfo(offerData, currentCurrenciesRates);
	}

}


module.exports = UsersFilterService;
