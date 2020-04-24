
module.exports = function (sequelize, DataTypes) {
	const customer_reminders = sequelize.define('customer_reminders', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		reminder_id: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		},
		customer_account_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'customer_account',
				key: 'id'
			}
		},
		frequency: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		reminder_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		last_purchase_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		custom_reminder_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		},
		reminder_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
	}, {
		tableName: 'customer_reminders',
		timestamps: false,
		underscored: true
	});

	return customer_reminders;
};
