/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const pricing = sequelize.define('pricing', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		sales_channel_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'sales_channel',
				key: 'id'
			}
		},
		product_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'product',
				key: 'id'
			}
		},
		applies_to: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		cogs_amount: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},	
		price_currency: {
			type: DataTypes.TEXT,
			allowNull: true,
		},		
		pricing_scheme_id:{
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'pricing_scheme',
				key: 'id'
			}
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		price_amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
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
		tableName: 'pricing',
		timestamps: false,
		underscored: true
	});

	return pricing;
};
