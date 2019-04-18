const NormalizeHelper = require('../helpers/normalize.helper');

class UserFilterRepository {

	constructor({ dbConnection }) {
		this.models = dbConnection.models;
	}

	/**
	 *
	 * @param filterObject
	 * @returns {Promise<*>}
	 */
	async createUserFilter(filterObject, userId) {

		const {
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
		} = filterObject;

		const user = await this.models.UserFilter.create({
			user_id: userId,
			country_code: countryCode,
			city,
			price_from: priceFrom,
			price_to: priceTo,
			currency,
			square_from: squareFrom,
			square_to: squareTo,
			room_total: roomTotal,
			permits_mask: permitsMask,
			type,
		});

		return user;
	}

	/**
	 *
	 * @param filterObject
	 * @param userId
	 * @returns {Promise<Model>}
	 */
	async fetchUserFilter(filterObject, userId) {

		const whereClause = NormalizeHelper.removeUndefinedValuesFields(filterObject);

		const normalizedWhereFieldsObject = {};

		Object.keys(whereClause).forEach(camelCaseKey => {
			const underscoreKey = NormalizeHelper.camelToUnderscoreCase(camelCaseKey);
			normalizedWhereFieldsObject[underscoreKey] = filterObject[camelCaseKey];
		});

		normalizedWhereFieldsObject.user_id = userId;


		const userFilter = await this.models.UserFilter.findOne({
			where: normalizedWhereFieldsObject,
		});

		return userFilter;
	}

	/**
	 *
	 * @param {String} refreshToken
	 * @return {Promise.<*>}
	 */
	async removeUserFilter(refreshToken) {
		// TODO удалять фильтры
		return this.models.UserToken.destroy({
			where: {
				refresh_token: refreshToken,
			},
		}).then(() => true);

	}


}

module.exports = UserFilterRepository;
