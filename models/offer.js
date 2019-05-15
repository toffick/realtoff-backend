const { REAL_TYPES, CURRENCY_TYPES, OFFER_STATUS } = require('../constants/constants');

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
		},
		description_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'description',
				key: 'id',
			},
		},
		preview_photo_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'offer_photo',
				key: 'id',
			},
		},
		status: {
			type: DataTypes.ENUM,
			values: Object.values(OFFER_STATUS),
			defaultValue: OFFER_STATUS.OPEN,
			allowNull: false,
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

		// TODO sry
		Offer.belongsTo(models.OfferPhoto, {
			onDelete: 'CASCADE',
			as: 'preview',
			foreignKey: {
				field: 'preview_photo_id',
				allowNull: true,
			},
		});

		Offer.hasMany(models.OfferPhoto, {
			onDelete: 'CASCADE',
			as: 'photos'
		});


		Offer.belongsToMany(models.Subway, {
			onDelete: 'CASCADE',
			through: 'OfferSubway',
			foreignKey: 'offer_id'
		});

	};

	return Offer;
};
