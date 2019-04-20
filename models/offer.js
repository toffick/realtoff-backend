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
			references: {
				model: 'user',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		address_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'address',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		description_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'description',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		type: {
			type: DataTypes.ENUM,
			values: Object.values(REAL_TYPES),
		},
		price_per_month: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		currency: {
			type: DataTypes.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		additional_phone_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updated_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
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

		Offer.belongsTo(models.Address, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'address_id',
				allowNull: false,
			},
		});

		Offer.belongsTo(models.Description, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'description_id',
				allowNull: false,
			},
		});

		Offer.hasMany(models.OfferPhoto, {
			onDelete: 'CASCADE',
		});
	};

	return Offer;
};
