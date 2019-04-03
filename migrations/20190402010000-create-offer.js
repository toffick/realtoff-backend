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
		},
		type: {
			type: Sequelize.ENUM,
			values: Object.values(REAL_TYPES),
		},
		city: {
			allowNull: false,
			type: Sequelize.STRING(255),
		},
		street: {
			allowNull: false,
			type: Sequelize.STRING(255),
		},
		house_number: {
			allowNull: false,
			type: Sequelize.STRING(8),
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
		price_per_month: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		currency: {
			type: Sequelize.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		description: {
			allowNull: false,
			type: Sequelize.STRING(2000),
		},
		coordinates: {
			allowNull: false,
			type: Sequelize.GEOMETRY('POINT'),
		},
		permits_mask: {
			allowNull: false,
			type: Sequelize.INTEGER,
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
