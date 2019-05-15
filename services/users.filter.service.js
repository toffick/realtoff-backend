const _ = require('lodash');
const CustomError = require('../components/errors/custom.error');

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

	/**
	 *
	 * @param filterObject
	 * @param userId
	 * @returns {Promise<*>}
	 */
	async saveFilter(filterObject, userId) {
		const userFilter = await this.userFilterRepository.fetchUserFilter(filterObject, userId);

		if (userFilter) {
			throw new CustomError('Фильтр с такими параметрами уже существует', 'user_filter', 409);
		}

		return this.userFilterRepository.create(filterObject, userId);
	}

	/**
	 *
	 * @param offerData
	 * @returns {Promise<*>}
	 */
	async getSubscribersEmails(offerData) {
		const currentCurrenciesRates = this.currenciesRatesService.currencyRates;

		return this.userFilterRepository.findSubscribersByOfferInfo(offerData, currentCurrenciesRates);
	}

	/**
	 * @param userId
	 * @param filterId
	 * @returns {Promise<*>}
	 */
	async removeFilter(userId, filterId) {
		return this.userFilterRepository.remove(userId, filterId);
	}

}


module.exports = UsersFilterService;
