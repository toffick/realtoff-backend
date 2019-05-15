
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('subway', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		address_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'address',
				key: 'id',
			},
		},
		name: {
			allowNull: false,
			type: Sequelize.STRING,
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		updated_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('subway'),
};
