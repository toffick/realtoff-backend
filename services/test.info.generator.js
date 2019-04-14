const iso = require('iso-3166-1');
const usersData = require('../test_data/users');
const usersPersonalData = require('../test_data/personal_info');
const offersData = require('../test_data/offers');

class OfferService {

	/**
	 *
	 * @param config
	 * @param offerRepository
	 * @param dbConnection
	 * @param {OfferService} offerService
	 * @param {UsersService} usersService
	 */
	constructor({
		config, offerRepository, dbConnection, offerService, usersService,
	}) {
		this.dbConnection = dbConnection;
		this.config = config;
		this.offerService = offerService;
		this.usersService = usersService;
	}

	async insertTestData() {

		try {
			const ids = (await Promise.all(usersData.map((item) => this.usersService.createUser(item.email, item.password, item.nickname))))
				.map((res) => res.user.id);

			ids.forEach(async (id, index) => {
				const { firstName, telephoneNumber, isPersonalLessor } = usersPersonalData[index];
				await this.usersService.setPersonalInfo(id, firstName, telephoneNumber, isPersonalLessor);
			});

			ids.forEach(async (id, index) => {
				const offerItem = offersData[index];
				const user = await this.offerService.createOffer(offerItem, id);
			});

			return true;

		} catch (e) {
			throw e;
		}
	}

}

module.exports = OfferService;
