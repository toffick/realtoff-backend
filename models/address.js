module.exports = (sequelize, DataTypes) => {

	const Address = sequelize.define('Address', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		country_code: {
			allowNull: false,
			type: DataTypes.STRING(5),
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
		coordinates: {
			allowNull: false,
			type: DataTypes.GEOMETRY('POINT'),
		},
	}, {
		tableName: 'address',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Address;
};
