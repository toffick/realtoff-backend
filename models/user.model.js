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
			allowNull: false,
		},
		second_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		telephone_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_personal_lessor: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
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
			beforeCreate: (user) => bcrypt.genSalt(11)
				.then((salt) => bcrypt.hash(user.password, salt))
				.then((hash) => user.password = hash),
		},
	});

	User.prototype.comparePassword = (candidatePassword) => {
		return new Promise((resolve, reject) => bcrypt.compare(candidatePassword, this.password_hash, (err, isMatch) => {
			if (err) {
				return reject(err);
			}

			return resolve(isMatch);
		}));
	};


	return User;
};
