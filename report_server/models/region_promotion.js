/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const region_promotion = sequelize.define('region_promotion', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		promotion_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'promotion',
				key: 'id'
			}
		},
        region_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'region',
				key: 'id'
			}
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		},
	}, {
		tableName: 'region_promotion',
		timestamps: false,
		underscored: true
    });
    return region_promotion;
};
