module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn('user_filter', 'is_personal_lessor', {
		type: Sequelize.BOOLEAN,
		allowNull: true,
	}),


	down: (queryInterface, Sequelize) => queryInterface.removeColumn('user_filter', 'is_personal_lessor', {
		type: Sequelize.BOOLEAN,
		allowNull: true,
	}),
};

