const iso = require('iso-3166-1');

const BaseForm = require('./base.form');
const validator = require('../validator');
const { REALTY_TYPES, CURRENCY_TYPES, RENT_PERMITS } = require('../../constants/constants');

class UserFilter extends BaseForm {


	/**
	 *
	 * @param countryCode
	 * @param city
	 * @param priceFrom
	 * @param priceTo
	 * @param currency
	 * @param squareFrom
	 * @param squareTo
	 * @param roomTotal
	 * @param permitsMask
	 * @param type
	 * @param userId
	 */
	constructor({
		countryCode,
		city,
		priceFrom,
		priceTo,
		currency,
		squareFrom,
		squareTo,
		roomTotal,
		permitsMask,
		type,
		userId,
	}) {
		super();

		this.countryCode = validator.trim(countryCode);
		this.city = validator.trim(city);
		this.roomTotal = Number(roomTotal);
		this.currency = currency;
		this.priceFrom = Number(priceFrom);
		this.priceTo = Number(priceTo);
		this.squareFrom = Number(squareFrom);
		this.squareTo = Number(squareTo);
		this.permitsMask = Number(permitsMask);
		this.type = type;
		this.userId = userId;
	}

	/**
     *
	 * @return {Promise.<*>}
	 */
	async validate() {

		if (!iso.whereAlpha2(this.countryCode)) {
			this.addError('Invalid countryCode. Enter a valid country code in iso-3166-1/alpha-2', 'countryCode');
			return false;
		}

		if (validator.isEmpty(this.city) || this.city.length > 255) {
			this.addError('Invalid city. Enter a valid city', 'city');
			return false;
		}

		if (!validator.isNumeric(this.roomTotal)
			|| this.roomTotal < 1) {
			delete this.roomTotal;
		}

		if (!this.currency || !CURRENCY_TYPES[this.currency.toUpperCase()]) {
			delete this.currency;
			delete this.priceFrom;
			delete this.priceTo;
		} else {
			if (!validator.isNumeric(this.priceFrom)
				|| this.priceFrom <= 0) {
				delete this.priceFrom;
			}

			if (!validator.isNumeric(this.priceTo)
				|| this.priceFrom <= 0
				|| this.priceTo <= 1
				|| (this.priceFrom && this.priceFrom > this.priceTo)) {
				delete this.priceTo;
			}
		}

		if (!validator.isNumeric(this.squareFrom)
			|| this.squareFrom < 0) {
			delete this.squareFrom;
		} else {
			this.squareFrom = Number(this.squareFrom);
		}

		if (!validator.isNumeric(this.squareTo)
			|| this.squareTo < 0
			|| (this.squareFrom && this.squareFrom > this.squareTo)) {
			delete this.squareTo;
		}

		if (!this.type || !REALTY_TYPES[this.type.toUpperCase()]) {
			delete this.type;
		}

		const integerMask = this.permitsMask;
		const maxMaskValue = Math.max(...Object.values(RENT_PERMITS));

		if (!validator.isNumeric(integerMask) || integerMask < 1 || integerMask > maxMaskValue) {
			delete this.permitsMask;
		}

		if (this.hasErrors()) {
			return false;
		}

		return this.isValid();

	}

}

module.exports = UserFilter;
