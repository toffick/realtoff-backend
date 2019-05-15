module.exports = (sequelize, DataTypes) => {

	const Subway = sequelize.define('Subway', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		address_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'address',
				key: 'id',
			},
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
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
		tableName: 'subway',
		freezeTableName: true,
		underscored: true,
	});

	Subway.associate = (models) => {

		Subway.belongsTo(models.Address, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'address_id',
				allowNull: false,
			},
		});

	};

	return Subway;
};
