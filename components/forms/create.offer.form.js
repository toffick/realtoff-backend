const BaseForm = require('./base.form');
const { REAL_TYPES, CURRENCY_TYPES, RENT_PERMITS } = require('../../constants/constants');
const validator = require('../validator');
const BigNumber = require('bignumber.js');

class CreateOfferForm extends BaseForm {


	/**
	 *
	 * @param city
	 * @param street
	 * @param houseNumber
	 * @param floorNumber
	 * @param floorTotal
	 * @param coordinates
	 * @param pricePerMonth
	 * @param currency
	 * @param description
	 * @param permitsMask
	 */
	constructor({
		city,
		street,
		houseNumber,
		floorNumber,
		floorTotal,
		coordinates,
		pricePerMonth,
		currency,
		description,
		permitsMask,
		type,
	}) {
		super();

		this.type = validator.trim(type);
		this.city = validator.trim(city);
		this.street = validator.trim(street);
		this.houseNumber = validator.trim(houseNumber);
		this.floorNumber = floorNumber;
		this.floorTotal = floorTotal;
		this.coordinates = coordinates;
		this.pricePerMonth = pricePerMonth;
		this.currency = currency;
		this.description = validator.trim(description);
		this.permitsMask = validator.trim(permitsMask);
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {
		if (!REAL_TYPES[this.type.toUpperCase()]) {
			this.addError('invalid realty type', 'type');
		}

		if (validator.isEmpty(this.city)) {
			this.addError('city is required', 'city');
		}

		if (this.city.length > 255) {
			this.addError('Invalid city length', 'city');
		}

		if (validator.isEmpty(this.street)) {
			this.addError('street is required', 'street');
		}

		if (this.street.length > 255) {
			this.addError('Invalid street length', 'street');
		}

		if (validator.isEmpty(this.houseNumber)) {
			this.addError('houseNumber is required', 'house_number');
		}

		if (this.street.length > 10) {
			this.addError('Invalid houseNumber', 'house_number');
		}

		if (isNaN(this.floorNumber) || this.floorTotal < 1 || this.floorNumber - this.floorTotal > 0) {
			this.addError('invalid floorNumber', 'floor_number');
		}

		if (isNaN(this.floorTotal) || this.floorNumber < 1 || this.floorNumber - this.floorTotal > 0) {
			this.addError('invalid floorNumber', 'floor_total');
		}

		if (isNaN(this.pricePerMonth) || this.pricePerMonth < 0) {
			this.addError('invalid floorNumber', 'telephone_number');
		}

		if (this.description < 140 || this.description < 2000) {
			this.addError('invalid description length. From 90 to 2000', 'telephone_number');
		}

		if (!CURRENCY_TYPES[this.currency]) {
			this.addError('invalid currency type', 'currency');
		}

		if (!/[01]+$/g.test(this.permitsMask)) {
			this.addError('Wrong permitsMask signature', 'permits_mask');
		}

		const integerMask = Number.parseInt(this.permitsMask, 2);
		const maxMaskValue = Math.max(...Object.values(RENT_PERMITS));

		if (integerMask > maxMaskValue) {
			this.addError('Wrong permitsMask value', 'permits_mask');
		}

		if (this.hasErrors()) {
			return false;
		}

		await this.normalizeCoordinates();

		return this.isValid();
	}

	async normalizeCoordinates() {
		const { latitude, longitude } = this.coordinates;

		if (!latitude || !longitude) {
			this.addError('Wrong coordinates value', 'coordinates');
		}

		if (validator.isEmpty(latitude) || latitude.length > 24) {
			this.addError('Invalid coordinates.latitude length', 'coordinates.latitude');
		}

		if (validator.isEmpty(longitude) || longitude.length > 24) {
			this.addError('Invalid coordinates.longitude length', 'coordinates.longitude');
		}

		const latitudeBN = new BigNumber(latitude);
		const longitudeBN = new BigNumber(longitude);

		if (latitudeBN.lt(-90) || latitudeBN.gt(90)) {
			this.addError('Invalid coordinates.latitudeBN value', 'coordinates.latitudeBN');
		}

		if (longitudeBN.lt(-180) || longitudeBN.gt(180)) {
			this.addError('Invalid coordinates.latitudeBN value', 'coordinates.latitudeBN');
		}

		if (this.hasErrors()) {
			return false;
		}

		this.coordinates = { latitudeBN, longitudeBN };

		// TODO

	}

	getFormObject() {
		const {
			city,
			street,
			houseNumber,
			floorNumber,
			floorTotal,
			coordinates,
			pricePerMonth,
			currency,
			description,
			permitsMask,
			type,
		} = this;

		return {
			city,
			street,
			houseNumber,
			floorNumber: Number(floorNumber),
			floorTotal: Number(floorTotal),
			coordinates,
			pricePerMonth,
			currency,
			description,
			permitsMask,
			type,
		};
	}

}

module.exports = CreateOfferForm;
