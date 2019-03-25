module.exports = (sequelize, DataTypes) => {
	const UserToken = sequelize.define('UserToken', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		refresh_token: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	}, {
		tableName: 'user_token',
		freezeTableName: true,
		underscored: true,
	});

	UserToken.associate = (models) => {
		UserToken.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: {
				field: 'user_id',
				allowNull: false,
			},
		});
	};

	return UserToken;
};
