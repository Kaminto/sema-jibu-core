/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const franchise= sequelize.define('franchise', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: false
        },
        code: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		}
	}, {
		tableName: 'franchise',
		timestamps: false,
		underscored: true
	});
	
	return franchise;
};
