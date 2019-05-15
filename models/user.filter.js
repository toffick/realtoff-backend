const { REAL_TYPES, CURRENCY_TYPES } = require('../constants/constants');

module.exports = (sequelize, DataTypes) => {
	const UserToken = sequelize.define('UserFilter', {
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
		country_code: {
			allowNull: false,
			type: DataTypes.STRING(5),
		},
		city: {
			allowNull: false,
			type: DataTypes.STRING(255),
		},
		price_from: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		price_to: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		currency: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.ENUM,
			values: Object.values(CURRENCY_TYPES),
		},
		square_from: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		square_to: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		room_total: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		permits_mask: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		type: {
			defaultValue: null,
			allowNull: true,
			type: DataTypes.ENUM,
			values: Object.values(REAL_TYPES),
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updated_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		is_personal_lessor: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
		},
		near_subway:{
			allowNull: true,
			type: DataTypes.BOOLEAN,
		}
	}, {
		tableName: 'user_filter',
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
