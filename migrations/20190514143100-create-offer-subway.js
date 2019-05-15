module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('offer_subway', {
		average_distance: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		offer_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'offer',
				key: 'id',
			},
		},
		subway_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'subway',
				key: 'id',
			},
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('offer_subway'),
};
