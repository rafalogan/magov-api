import Sequelize, { Model } from 'sequelize';

class Revenue extends Model {

    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
                receive_date: Sequelize.DATE,
                quantity: Sequelize.INTEGER,
                unit: Sequelize.INTEGER,
                document: Sequelize.STRING,
                document_url: Sequelize.STRING,
                value: Sequelize.DECIMAL(16,2),
                observation: Sequelize.STRING,
                status: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'revenue',
            }
        );
        return this;
    }
    static associate(models) {
        this.hasMany(models.Proposition, { foreignKey: 'revenue' })
        this.hasMany(models.RevenueOrigin, { foreignKey: 'revenue' })
        this.hasMany(models.RevenueReceiptForm, { foreignKey: 'revenue' })
        this.hasOne(models.RevenueTypeRevenue, { foreignKey: 'revenue' })
        this.hasMany(models.EngageDocument, {foreignKey: 'revenue'})
        this.belongsTo(models.Unit, {foreignKey: 'unit'})
        this.hasMany(models.PropositionRevenue, { foreignKey: 'revenue' })
    }
}

export default Revenue;
