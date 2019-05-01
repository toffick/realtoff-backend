const { USER_ROLES } = require('../constants/constants');

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('user', 'role', {
		type: Sequelize.ENUM,
		values: Object.values(USER_ROLES),
		defaultValue: USER_ROLES.USER,
	}),
	down: (queryInterface, Sequelize) => queryInterface.removeColumn('user', 'role', {
		type: Sequelize.ENUM,
		values: Object.values(USER_ROLES),
		defaultValue: USER_ROLES.USER,
	}),
};
