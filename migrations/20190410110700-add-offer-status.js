const { OFFER_STATUS } = require('../constants/constants');

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('offer', 'status', {
		type: Sequelize.ENUM,
		values: Object.values(OFFER_STATUS),
		defaultValue: OFFER_STATUS.OPEN,
		allowNull: false,
	}),

	down: (queryInterface, Sequelize) => queryInterface.removeColumn('offer', 'status', {
		type: Sequelize.ENUM,
		allowNull: false,
		defaultValue: false,
	}),
};
