module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('offer_photo', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		offer_id: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		file_name: {
			allowNull: false,
			type: Sequelize.STRING(256),
		},
		is_main: {
			allowNull: false,
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('offer_photo'),
};
