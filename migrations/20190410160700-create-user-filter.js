const { REAL_TYPES, CURRENCY_TYPES } = require('../constants/constants');

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user_filter', {
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
		country_code: {
			allowNull: false,
			type: Sequelize.STRING(5),
		},
		city: {
			allowNull: false,
			type: Sequelize.STRING(255),
		},
		price_from: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		price_to: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		currency: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		square_from: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		square_to: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		room_total: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		permits_mask: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		type: {
			defaultValue: null,
			allowNull: true,
			type: Sequelize.ENUM,
			values: Object.values(REAL_TYPES),
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('user_filter'),
};
