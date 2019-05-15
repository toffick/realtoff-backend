module.exports = (sequelize, DataTypes) => {

	const OfferSubway = sequelize.define('OfferSubway', {
		average_distance: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		offer_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'offer',
				key: 'id',
			},
		},
		subway_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'subway',
				key: 'id',
			},
		},
	}, {
		tableName: 'offer_subway',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	OfferSubway.associate = (models) => {

		OfferSubway.belongsTo(models.Offer, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'offer_id',
				allowNull: false,
			},
		});

		OfferSubway.belongsTo(models.Subway, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'subway_id',
				allowNull: false,
			},
		});

	};

	return OfferSubway;
};
