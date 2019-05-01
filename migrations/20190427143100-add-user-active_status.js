const { USER_STATUS } = require('../constants/constants');

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('user', 'status', {
		type: Sequelize.ENUM,
		values: Object.values(USER_STATUS),
		defaultValue: USER_STATUS.ACTIVE,
	}),
	down: (queryInterface, Sequelize) => queryInterface.removeColumn('user', 'status', {
		type: Sequelize.ENUM,
		values: Object.values(USER_STATUS),
		defaultValue: USER_STATUS.ACTIVE,
	}),
};
