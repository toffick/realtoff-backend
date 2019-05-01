/* eslint-disable max-len */
const NormalizeHelper = require('../helpers/normalize.helper');

class UserFilterRepository {

	constructor({ dbConnection }) {
		this.models = dbConnection.models;
		this.dbConnection = dbConnection;
	}

	/**
	 *
	 * @param filterObject
	 * @returns {Promise<*>}
	 */
	async create(filterObject, userId) {

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
			isPersonalLessor,
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
			is_personal_lessor: isPersonalLessor,
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

		Object.keys(whereClause).forEach((camelCaseKey) => {
			const underscoreKey = NormalizeHelper.camelToUnderscoreCase(camelCaseKey);
			normalizedWhereFieldsObject[underscoreKey] = filterObject[camelCaseKey];
		});

		normalizedWhereFieldsObject.user_id = userId;


		const userFilter = await this.models.UserFilter.findOne({
			where: normalizedWhereFieldsObject,
		});

		return userFilter;
	}

	async findSubscribersByOfferInfo(queryObject, currentCurrenciesRates) {
		const sqlQuery = this._searchQueryBuilder(queryObject, currentCurrenciesRates);

		return this.dbConnection.sequelize.query(
			sqlQuery,
			{
				replacements: queryObject,
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
			},
		);
	}


	/**
	 *
	 * @param {MetaSearch} queryObject
	 * @param currentCurrenciesRates
	 * @private
	 */
	_searchQueryBuilder(queryObject, currentCurrenciesRates) {
		const currentCurrency = currentCurrenciesRates[queryObject.currency];

		let where = `select DISTINCT u.id, u.email
						from user_filter as uf
						join "user" as u
						on u.id = uf.user_id
					where 
						uf.user_id <> :userId
						and	country_code=:countryCode
						and city=:city
						and type=:type
						and (permits_mask & :permitsMask > 0 or permits_mask isnull)
						and (room_total = :roomTotal or room_total isnull)
						
						and	(price_from >= 
							(
								case
									when uf.currency is null then 0
									when uf.currency = :currency then :pricePerMonth		
									${currentCurrency.map((item) => `when uf.currency = '${item.to}' then :pricePerMonth * ${item.val}`)}								
								end
							)
							or price_from isnull)
							
							
						and	(price_to >= 
						(
							case
								when uf.currency is null then 0
								when uf.currency = :currency then :pricePerMonth
								${currentCurrency.map((item) => `when uf.currency = '${item.to}' then :pricePerMonth * ${item.val}`)}
							end
						)
						or price_to isnull)				
						and (square_from >= :squareTotal or square_from isnull)
						and (square_to <= :squareTotal or square_to isnull)	
						and (
							case
								when uf.is_personal_lessor=true 
									then u.is_personal_lessor=true  
									else true
							end
						)
					`;

		return where;

	}

	/**
	 *
	 * @param userId
	 * @param filterId
	 * @returns {Promise<*|PromiseLike<boolean | never>|Promise<boolean | never>>}
	 */
	async remove(userId, filterId) {
		return this.models.UserFilter.destroy({
			where: {
				user_id: userId,
				id: filterId,
			},
		});

	}

	/**
	 *
	 * @param userId
	 * @param filterId
	 * @returns {Promise<*|PromiseLike<boolean | never>|Promise<boolean | never>>}
	 */
	async removeAllByUserId(userId) {
		return this.models.UserFilter.destroy({
			where: {
				user_id: userId,
			},
		});

	}


}

module.exports = UserFilterRepository;
