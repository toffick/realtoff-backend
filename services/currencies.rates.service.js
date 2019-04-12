const axios = require('axios');
const { CURRENCY_TYPES } = require('../constants/constants');

const logger = require('log4js').getLogger('currencies.rates.service.js');

logger.level = 'debug';

class CurrenciesRatesService {

	/**
	 * @param {Object} opts
	 * @param {String} opts.basePath
	 * @param {AppConfig} opts.config
	 */
	constructor(opts) {
		this.updateIntervalMin = opts.config.CURRENCY_UPDATING_INTERVAL_MIN;
		this.apiKey = opts.config.CURRENCY_CONVERTER_API_KEY;
		this.apiUrl = 'https://free.currconv.com/api/v7/convert';

		this.currencyRates = Object.values(CURRENCY_TYPES).reduce((a, i) => ({ ...a, [i]: null }), {});

		this.initUpdating();
	}

	/**
	 * start updating currencies rates
	 */
	initUpdating() {
		this.update();
		setInterval(() => { this.update(); }, this.updateIntervalMin * 60 * 1000);
	}

	/**
	 * method is called 60/this.updateIntervalMin times per hour.
	 * it calls free.currconv.com's api for actual CURRENCY_TYPES's rates and puts
	 * them into this.currencyRates storage
	 */
	update() {
		const currencies = Object.values(CURRENCY_TYPES);
		currencies.forEach((currency) => {
			const currentCurrencyPairsQuery = currencies
				.filter((cur) => cur !== currency)
				.map((otherCur) => (`${currency}_${otherCur}`))
				.join(',');

			axios.request({
				method: 'GET',
				url: this.apiUrl,
				params: {
					apiKey: this.apiKey,
					q: currentCurrencyPairsQuery,
				},
			})
				.then((result) => {
					const { data: { results } } = result;
					this.currencyRates[currency] = Object.values(results).map((resultItem) => ({ ...resultItem, id: null }));
					console.log(this.currencyRates);
				})
				.catch((err) => {
					logger.warn(`Update currency rates for ${currency} error`, err);
				});
		});
	}

}

module.exports = CurrenciesRatesService;
