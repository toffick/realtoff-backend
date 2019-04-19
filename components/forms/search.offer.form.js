const iso = require('iso-3166-1');

const BaseForm = require('./base.form');
const { REAL_TYPES, CURRENCY_TYPES, RENT_PERMITS } = require('../../constants/constants');
const validator = require('../validator');

class SearchForm extends BaseForm {

	/**
	 *
	 * @param currency
	 * @param permitsMask
	 * @param priceFrom
	 * @param priceTo
	 * @param squareFrom
	 * @param squareTo
	 * @param roomTotal
	 * @param type
	 * @param countryCode
	 * @param city
	 * @param bounds
	 * @param nearPlaceCoordinates
	 */
	constructor({
		currency,
		permitsMask,
		priceFrom,
		priceTo,
		squareFrom,
		squareTo,
		roomTotal,
		type,
		countryCode,
		city,
		isPersonalLessor,
		// TODO
		bounds,
		// TODO
		nearPlaceCoordinates,

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
		this.isPersonalLessor = isPersonalLessor;
		this.type = type;
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

			if (!this.priceTo && !this.priceFrom) {
				delete this.currency;
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

		if (!this.type || !REAL_TYPES[this.type.toUpperCase()]) {
			delete this.type;
		}

		const integerMask = this.permitsMask;

		// TODO fix this
		const maxMaskValue = Object.values(RENT_PERMITS).reduce((a, i) => a + i, 0);

		if (!validator.isNumeric(integerMask) || integerMask < 1 || integerMask > maxMaskValue) {
			delete this.permitsMask;
		}

		if (!this.isPersonalLessor) {
			delete this.isPersonalLessor;
		}

		if (this.hasErrors()) {
			return false;
		}

		return this.isValid();
	}

	/**
	 *
	 * @returns {MetaSearch}
	 */
	getFormObject() {
		const {
			countryCode,
			city,
			roomTotal,
			currency,
			permitsMask,
			type,
			priceFrom,
			priceTo,
			squareFrom,
			squareTo,
			isPersonalLessor,
		} = this;

		return {
			countryCode,
			city: city.toLowerCase(),
			roomTotal,
			currency,
			permitsMask,
			type,
			priceFrom,
			priceTo,
			squareFrom,
			squareTo,
			isPersonalLessor,
		};
	}

}

module.exports = SearchForm;
