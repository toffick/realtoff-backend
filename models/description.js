module.exports = (sequelize, DataTypes) => {

	const Description = sequelize.define('Description', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
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
		room_total: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		description: {
			allowNull: false,
			type: DataTypes.STRING(2000),
		},
		permits_mask: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		square_total: {
			allowNull: false,
			type: DataTypes.FLOAT,
		},
	}, {
		tableName: 'description',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Description;
};
