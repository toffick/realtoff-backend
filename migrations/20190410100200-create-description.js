module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('description', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		floor_number: {
			allowNull: true,
			defaultValue: null,
			type: Sequelize.INTEGER,
		},
		floor_total: {
			allowNull: true,
			defaultValue: null,
			type: Sequelize.INTEGER,
		},
		room_total: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		description: {
			allowNull: false,
			type: Sequelize.STRING(2000),
		},
		permits_mask: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		square_total: {
			allowNull: false,
			type: Sequelize.FLOAT,
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('description'),
};
