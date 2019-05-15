module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('user_filter', 'near_subway', {
		type: Sequelize.BOOLEAN,
		allowNull: true,
	}),
	down: (queryInterface, Sequelize) => queryInterface.removeColumn('user_filter', 'near_subway', {
		type: Sequelize.BOOLEAN,
		allowNull: true,
	}),
};

