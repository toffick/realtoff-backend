module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
		await queryInterface.addColumn('offer', 'preview_photo_id', {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'offer_photo',
				key: 'id',
			},
			onUpdate: 'cascade',
			onDelete: 'cascade',
		}, { transaction });
		await queryInterface.sequelize.query('alter table offer_photo drop column is_main', {
			transaction,
		});
		await queryInterface.sequelize.query('alter table offer_photo add column destination varchar(255)', {
			transaction,
		});
	}),
	down: (queryInterface, Sequelize) => null,
};
