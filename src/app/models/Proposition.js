import Sequelize, { Model } from 'sequelize';

class Proposition extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                menu: Sequelize.STRING,
                deadline: Sequelize.DATE,
                revenue: Sequelize.INTEGER,
                expense: Sequelize.INTEGER,
                favorite: Sequelize.INTEGER,
                committed: Sequelize.INTEGER,
                responsible: Sequelize.INTEGER,
                created_by: Sequelize.INTEGER,
                status: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
                unit: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition'
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Expense, { foreignKey: 'expense' });
        this.belongsTo(models.User, { foreignKey: 'created_by' });
        this.hasMany(models.PropositionRevenue, { foreignKey: 'proposition' });
        this.hasMany(models.PropositionTheme, { foreignKey: 'proposition' });
        this.hasMany(models.PropositionTask, { foreignKey: 'proposition' });
        this.hasMany(models.PropositionRelated, { foreignKey: 'proposition' });
        this.hasMany(models.PropositionDemand, { foreignKey: 'proposition' });
        this.hasOne(models.PropositionDocument, { foreignKey: 'proposition' });
        this.hasMany(models.PropositionGoal, { foreignKey: 'proposition' });
        this.hasMany(models.Propositionkeyword, { foreignKey: 'proposition' });
        this.hasOne(models.PropositionTypeProposition, {
            foreignKey: 'proposition'
        });
        this.belongsTo(models.PhysicalPerson, { foreignKey: 'responsible' });
        this.belongsTo(models.Revenue, { foreignKey: 'revenue' });
        this.belongsTo(models.Unit, { foreignKey: 'unit' });
    }
}

export default Proposition;
