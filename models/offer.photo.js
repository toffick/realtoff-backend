module.exports = (sequelize, DataTypes) => {
	const OfferPhoto = sequelize.define('OfferPhoto', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		offer_id: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		file_name: {
			allowNull: false,
			type: DataTypes.STRING(256),
		},
		is_main: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	}, {
		tableName: 'offer_photo',
		freezeTableName: true,
		underscored: true,
		timestamps: false
	});

	OfferPhoto.associate = (models) => {
		OfferPhoto.belongsTo(models.Offer, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'offer_id',
				allowNull: false,
			},
		});
	};

	return OfferPhoto;
};
