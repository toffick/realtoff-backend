const { REAL_TYPES, CURRENCY_TYPES } = require('../constants/constants');

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('offer', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		user_id: {
			allowNull: false,
			type: Sequelize.INTEGER,
			references: {
				model: 'user',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		address_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'address',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		description_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'description',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		type: {
			type: Sequelize.ENUM,
			values: Object.values(REAL_TYPES),
		},
		price_per_month: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		currency: {
			type: Sequelize.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		additional_phone_number: {
			type: Sequelize.STRING,
			allowNull: true,
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('offer'),
};
