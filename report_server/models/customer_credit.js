/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const customer_credit= sequelize.define('customer_credit', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		top_up_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		notes: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		customer_account_id: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'customer_account',
				key: 'id'
			}
		},
		topup: {
			type: DataTypes.DECIMAL,
			allowNull: false,
        },
        balance: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		}, 
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		},
		receipt_id: {
			type: DataTypes.STRING(255),
			allowNull: true,
			references: {
				model: 'receipt',
				key: 'id'
			}
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
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
	}, {
		tableName: 'customer_credit',
		timestamps: false,
		underscored: true
	});

	return customer_credit;
};
