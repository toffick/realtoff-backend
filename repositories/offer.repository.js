class OfferRepository {

	constructor({ dbConnection, config }) {
		this.dbConnection = dbConnection;
		this.models = dbConnection.models;
		this.Op = dbConnection.Sequelize.Op;
	}

	/**
	 *
	 * @param offerObject
	 * @param userId
	 * @param descriptionId
	 * @param addressId
	 * @returns {Promise<*>}
	 */
	async createOffer(offerObject, userId, descriptionId, addressId, { transaction } = { transaction: undefined }) {

		const offer = await this.models.Offer.create({
			user_id: userId,
			description_id: descriptionId,
			address_id: addressId,
			type: offerObject.type,
			additional_phone_number: offerObject.additionalTelephoneNumber,
			price_per_month: offerObject.pricePerMonth,
			currency: offerObject.currency,
		}, {
			raw: true,
			transaction,
		});

		return offer;
	}

	/**
	 *
	 * @returns {Promise<*>}
	 */
	async getCountriesOfOpenOffers() {
		return this.dbConnection.sequelize.query(
			`select DISTINCT  country_code 
				from offer as o 
				join address as a
				on a.id = o.address_id
				where o.status = 'OPEN'
			`,
			{
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
			},
		);

	}

	/**
	 *
	 * @returns {Promise<*>}
	 */
	async getOfferCitiesByCountryCode(countryCode) {
		return this.dbConnection.sequelize.query(
			`select DISTINCT city 
				from offer as o 
				join address as a
				on a.id = o.address_id
				where o.status = 'OPEN' and a.country_code = :countryCode
			`,
			{
				replacements: {
					countryCode,
				},
				type: this.dbConnection.sequelize.QueryTypes.SELECT,
			},
		);

	}

	async findByQueryObject(queryObject, currentCurrenciesRates) {
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
		let where = `select 
			o.id, o.created_at, o.price_per_month, o.currency, 
			a.country_code, a.city, a.street, a.house_number, a.coordinates,
			d.description
				from offer as o
				join address as a
				on o.address_id = a.id
				join description as d
				on o.description_id = d.id
				join public.user as u
				on o.user_id = u.id
				where 
					o.status = 'OPEN' 
					and country_code=:countryCode
					and city=:city`;

		const _uppendAndCondition = (condition) => {
			where += `
					and ${condition}`;
		};

		if (queryObject.type) {
			_uppendAndCondition('type=:type');
		}

		if (queryObject.roomTotal) {
			_uppendAndCondition('room_total=:roomTotal');
		}

		if (queryObject.squareFrom) {
			_uppendAndCondition('square_total >= :squareFrom');
		}

		if (queryObject.squareTo) {
			_uppendAndCondition('square_total <= :squareTo');
		}

		if (queryObject.permitsMask) {
			_uppendAndCondition('permits_mask & :permitsMask = :permitsMask');
		}

		if (queryObject.isPersonalLessor) {
			_uppendAndCondition('u.is_personal_lessor=true');
		}

		if (queryObject.priceFrom) {
			const currentCurrency = currentCurrenciesRates[queryObject.currency];
			const caseClause = `
				price_per_month >= 
				(
					case
						when o.currency = :currency then :priceFrom
						${currentCurrency.map((item) => `when o.currency = '${item.to}' then :priceFrom * ${item.val}`)}
					end
				)
			`;
			_uppendAndCondition(caseClause);
		}

		if (queryObject.priceTo) {
			const currentCurrency = currentCurrenciesRates[queryObject.currency];
			const caseClause = `
				price_per_month <= 
				(
					case
						when o.currency = :currency then :priceTo
						${currentCurrency.map((item) => `when o.currency = '${item.to}' then :priceTo * ${item.val}`)}
					end
				)
			`;
			_uppendAndCondition(caseClause);
		}


		where += `
			order by created_at desc;
		`;

		return where;

	}

	async findOfferById(id) {
		return this.models.Offer.findOne({
			where: {
				id,
			},
			attributes: { exclude: ['user_id', 'address_id', 'description_id'] },
			include: [{
				model: this.models.User,
				attributes: ['telephone_number', 'is_personal_lessor', 'first_name'],
			}, {
				model: this.models.Address,
				attributes: { exclude: ['id'] },
			},
			{
				model: this.models.Description,
				attributes: { exclude: ['id'] },
			}],
		});
	}

}

module.exports = OfferRepository;
