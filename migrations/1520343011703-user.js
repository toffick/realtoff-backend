
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password_hash: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		is_email_confirmed: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		first_name: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		second_name: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		telephone_number: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		is_personal_lessor: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		updated_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
	}).then(() => queryInterface.addConstraint('user', ['email'], {
		type: 'unique',
		name: 'user_email_key',
	})),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('user'),
};
