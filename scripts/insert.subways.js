const path = require('path');

process.env.NODE_CONFIG_DIR = path.join(__dirname, '..', '/config/');

const axios = require('axios');
const config = require('config');

const DbConnection = require('../connections/db.connection');
const AddressRepository = require('../repositories/address.repository');
const SubwayRepository = require('../repositories/subway.repository');

const getDatabaseConnection = async () => {
	const dbConnection = new DbConnection({ config });
	dbConnection.connect(() => {});
	return dbConnection;
};

const startScript = async () => {
	const dbConnection = await getDatabaseConnection();
	const addressResository = new AddressRepository({ dbConnection });
	const subwayRepository = new SubwayRepository({ dbConnection });

	const apiUrl = 'https://api.hh.ru/metro';

	const defaultCountryCode = 'RU';

	const byCities = {
		cc: 'BY',
		list: ['Минск'],
	};

	const uaCities = {
		cc: 'UA',
		list: ['Киев', 'Харьков', 'Днепр (Днепропетровск)'],
	};

	const { data } = await axios.get(apiUrl);

	const subways = [];

	data.forEach((item) => {
		const { name, lines } = item;
		let cc = defaultCountryCode;

		if (uaCities.list.includes(name)) {
			cc = uaCities.cc;
		}

		if (byCities.list.includes(name)) {
			cc = byCities.cc;
		}

		lines.forEach((line) => {
			line.stations.forEach((station) => {
				const address = {
					countryCode: cc,
					city: name.toLowerCase(),
					street: '',
					houseNumber: '',
					coordinates: {
						longitude: station.lng,
						latitude: station.lat,
					},
				};

				const subwayStation = {
					name: station.name,
				};

				subways.push({
					subwayStation,
					address,
				});
			});
		});
	});

	subways.forEach(async ({ subwayStation, address }) => {
		try {
			await dbConnection.sequelize.transaction({
				isolationLevel: dbConnection.sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
			}, async (transaction) => {
				const addressObj = await addressResository.createAddress(address, { transaction });
				const subway = await subwayRepository.create(subwayStation, addressObj.id, { transaction });
			});

		} catch (e) {
			console.log(e);
		}
	});

};

(async () => {
	try {
		await startScript();
	} catch (e) {
		console.log(e);
	}
})();
