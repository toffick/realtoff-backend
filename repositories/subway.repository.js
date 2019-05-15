/* eslint-disable max-len */
const { MINIMAL_METRO_DISTANCE_METRES } = require('../constants/constants');

class SubwayRepository {

	constructor({ dbConnection }) {
		this.dbConnection = dbConnection;
		this.models = dbConnection.models;
		this.Op = dbConnection.Sequelize.Op;
	}

	/**
	 *
	 * @param data
	 * @returns {Promise<*>}
	 */
	async create(data, addressId, { transaction } = { transaction: undefined }) {

		const subway = await this.models.Subway.create({
			name: data.name,
			address_id: addressId,
		}, { transaction });

		return subway;
	}

	async insertImmediateSubwaysWithOffer(coordinates, countryCode, city, offerId, { transaction } = { transaction: undefined }) {
		const { longitude, latitude } = coordinates;
		return this.dbConnection.sequelize.query(
			`
				insert into offer_subway 
				select distance, offer_id, subway_id
				from 
					(
					select 
							sw.id, st_distance_sphere(st_point(ST_Y(ad.coordinates), ST_X(ad.coordinates)),st_point(:longitude, :latitude)) as distance,
							sw.id as subway_id, 
							:offerId as offer_id
						from subway as sw join address as ad
						on sw.address_id = ad.id
						where 
							country_code=:countryCode and city=:city
					) as res
					where res.distance <= :radius
			`,
			{
				replacements: {
					radius: MINIMAL_METRO_DISTANCE_METRES,
					longitude: longitude.toString(),
					latitude: latitude.toString(),
					countryCode,
					city: city.toString(),
					offerId,
				},
				type: this.dbConnection.sequelize.QueryTypes.INSERT,
				raw: true,
				transaction,
				returning: true,
			},
		);
	}


}

module.exports = SubwayRepository;
