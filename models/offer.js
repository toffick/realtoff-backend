const { REAL_TYPES, CURRENCY_TYPES } = require('../constants/constants');

module.exports = (sequelize, DataTypes) => {

	const Offer = sequelize.define('Offer', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		user_id: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		type: {
			type: DataTypes.ENUM,
			values: Object.values(REAL_TYPES),
		},
		city: {
			allowNull: false,
			type: DataTypes.STRING(255),
		},
		street: {
			allowNull: false,
			type: DataTypes.STRING(255),
		},
		house_number: {
			allowNull: false,
			type: DataTypes.STRING(8),
		},
		floor_number: {
			allowNull: true,
			defaultValue: null,
			type: DataTypes.INTEGER,
		},
		floor_total: {
			allowNull: true,
			defaultValue: null,
			type: DataTypes.INTEGER,
		},
		price_per_month: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		currency: {
			type: DataTypes.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		description: {
			allowNull: false,
			type: DataTypes.STRING(2000),
		},
		coordinates: {
			allowNull: false,
			type: DataTypes.GEOMETRY('POINT'),
		},
		permits_mask: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updated_at: {
			allowNull: false,
			type: DataTypes.DATE,
		}
	}, {
		tableName: 'offer',
		freezeTableName: true,
		underscored: true,
	});

	Offer.associate = (models) => {
		Offer.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'user_id',
				allowNull: false,
			},
		});

	};


	return Offer;
};
