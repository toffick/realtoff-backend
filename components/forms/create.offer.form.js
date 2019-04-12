const BigNumber = require('bignumber.js');
const iso = require('iso-3166-1');

const BaseForm = require('./base.form');
const { REAL_TYPES: REALTY_TYPES, CURRENCY_TYPES, RENT_PERMITS } = require('../../constants/constants');
const validator = require('../validator');

class CreateOfferForm extends BaseForm {

	/**
	 *
	 * @param address
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
	 * @param additionalTelephoneNumber
	 * @param type
	 * @param roomTotal
	 * @param squareTotal
	 */
	constructor({
		address,
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
		additionalTelephoneNumber,
		type,
		roomTotal,
		squareTotal,
		countryCode,
	}) {
		super();

		this.type = validator.trim(type);
		this.address = validator.trim(address);
		this.countryCode = validator.trim(countryCode);
		this.city = validator.trim(city);
		this.street = validator.trim(street);
		this.houseNumber = validator.trim(houseNumber);
		this.floorNumber = floorNumber;
		this.floorTotal = floorTotal;
		this.roomTotal = roomTotal;
		this.coordinates = coordinates;
		this.pricePerMonth = pricePerMonth;
		this.currency = currency;
		this.additionalTelephoneNumber = additionalTelephoneNumber;
		this.description = validator.trim(description);
		this.permitsMask = validator.trim(permitsMask);
		this.squareTotal = squareTotal;
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async validate() {
		//TODO перечекать все пункты валидации
		if (!REALTY_TYPES[this.type.toUpperCase()]) {
			this.addError('invalid realty type', 'type');
		}

		if (this.address) {
			if (validator.isEmpty(this.address)) {
				this.addError('address is required', 'address');
			}

		} else {

			if (validator.isEmpty(this.countryCode)) {
				this.addError('countryCode is required', 'country');
			}

			if (!iso.whereAlpha2(this.countryCode)) {
				this.addError('Invalid countryCode', 'country_code');
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

			if (this.houseNumber.length > 10) {
				this.addError('Invalid houseNumber', 'house_number');
			}

		}

		if (this.type.toUpperCase() === REALTY_TYPES.FLAT) {
			if (!validator.isNumeric(this.floorNumber) || this.floorTotal < 1 || this.floorNumber - this.floorTotal > 0) {
				this.addError('invalid floorNumber', 'floor_number');
			}

			if (!validator.isNumeric(this.floorTotal) || this.floorNumber < 1 || this.floorNumber - this.floorTotal > 0) {
				this.addError('invalid floorNumber', 'floor_total');
			}
		}

		if (!validator.isNumeric(this.squareTotal) || this.squareTotal < 1) {
			this.addError('invalid squareTotal', 'square_total');
		}

		if (!validator.isNumeric(this.roomTotal) || this.roomTotal < 1) {
			this.addError('invalid roomTotal', 'room_total');
		}

		if (!validator.isNumeric(this.pricePerMonth) || this.pricePerMonth < 1) {
			this.addError('invalid pricePerMonth', 'price_per_month');
		}

		if (this.description < 140 || this.description > 2000) {
			this.addError('invalid description length. From 90 to 2000', 'description');
		}

		if (!CURRENCY_TYPES[this.currency.toUpperCase()]) {
			this.addError('invalid currency type', 'currency');
		}

		if (!validator.isMobilePhone(this.additionalTelephoneNumber)) {
			this.addError('invalid additionalTelephoneNumber', 'additional_telephone_number');
		}

		const integerMask = Number.parseInt(this.permitsMask, 10);
		const maxMaskValue = Math.max(...Object.values(RENT_PERMITS));

		if (!validator.isNumeric(integerMask) || integerMask < 1 || integerMask > maxMaskValue) {
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
			squareTotal,
			countryCode,
			city,
			street,
			houseNumber,
			floorNumber,
			floorTotal,
			roomTotal,
			additionalTelephoneNumber,
			pricePerMonth,
			currency,
			description,
			permitsMask,
			coordinates,
			type,
		} = this;

		return {
			countryCode,
			city: city.toLowerCase(),
			street,
			houseNumber,
			floorNumber: Number(floorNumber),
			floorTotal: Number(floorTotal),
			roomTotal: Number(roomTotal),
			additionalTelephoneNumber,
			pricePerMonth,
			currency,
			description,
			squareTotal,
			permitsMask: Number(permitsMask),
			coordinates,
			type,
		};
	}

}

module.exports = CreateOfferForm;
