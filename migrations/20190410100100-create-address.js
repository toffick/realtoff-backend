module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('address', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		country_code: {
			allowNull: false,
			type: Sequelize.STRING(5),
		},
		city: {
			allowNull: false,
			type: Sequelize.STRING(255),
		},
		street: {
			allowNull: false,
			type: Sequelize.STRING(255),
		},
		house_number: {
			allowNull: false,
			type: Sequelize.STRING(8),
		},
		coordinates: {
			allowNull: false,
			type: Sequelize.GEOMETRY('POINT'),
		},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('address'),
};
