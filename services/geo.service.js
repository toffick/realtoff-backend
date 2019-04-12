const axios = require('axios');
const transliteration = require('../utils/transliteration.utils');

class GeoService {


	constructor({config}) {
		this.config = config;
		this.api = 'https://geocode-maps.yandex.ru/1.x/?';
	}

	/**
	 *
	 * @param {{city, street, house}} addressObject
	 * @returns {Promise<number[]>}
	 */
	async getCoordinatesByAddress(addressObject) {
		const query = this._queryStringBuilder(addressObject);

		const result = await axios.get(query);

		const { response: { GeoObjectCollection: { featureMember } } } = result;

		const [addressInfo] = featureMember;

		const { GeoObject: { Point } } = addressInfo;

		const [lat, long] = Point.pos.split(' ');

		return [+lat, +long];
	}

	/**
	 *
	 * @param queryObject
	 * @returns {string}
	 * @private
	 */
	_queryStringBuilder(queryObject) {
		const queryString = Object.values(queryObject).join('+');
		const translitedString = transliteration(queryString);

		const addressPart = `geocode=${translitedString}`;
		const apiPart = `apikey=${this.config.YANDEX_API_KEY}`;
		const resultUrl = `${this.api + apiPart}&${addressPart}&ang=en-US&format=json`;

		return resultUrl;
	}

}

module.exports = GeoService;
