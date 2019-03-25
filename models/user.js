const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define('User', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_email_confirmed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		second_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		telephone_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		is_personal_lessor: {
			type: DataTypes.BOOLEAN,
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
		tableName: 'user',
		freezeTableName: true,
		underscored: true,
		instanceMethods: {
			comparePassword(candidatePassword) {
				return new Promise((resolve, reject) => bcrypt
					.compare(candidatePassword, this.password_hash, (err, isMatch) => (err ? reject(err) : resolve(isMatch))));

			},
		},
		hooks: {
			beforeCreate: async (user) => {
				const salt = await bcrypt.genSalt(11);
				const hash = await bcrypt.hash(user.password_hash, salt);

				user.password_hash = hash;
			},
		},
	});

	User.prototype.comparePassword = function (candidatePassword) {
		return new Promise((resolve, reject) =>
			bcrypt.compare(candidatePassword, this.password_hash, (err, isMatch) => {
				if (err) {
					return reject(err);
				}

				return resolve(isMatch);
			}));
	};


	return User;
};
