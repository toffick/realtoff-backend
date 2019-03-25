
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user_token', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.BIGINT,
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		refresh_token: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('user_token'),
};
