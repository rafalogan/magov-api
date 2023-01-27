import Sequelize, { Model } from 'sequelize';
class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                name_cabinet: Sequelize.STRING,
                email: Sequelize.STRING,
                contact: Sequelize.STRING,
                cnpj: Sequelize.STRING,
                cep: Sequelize.STRING,
                city: Sequelize.STRING,
                district: Sequelize.STRING,
                street: Sequelize.STRING,
                description: Sequelize.STRING,
                number: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
                unit: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'clients'
            }
        );
        return this;
    }
    static associate(models) {
        this.hasMany(models.Purchases, {
            foreignKey: 'client'
        });
        this.belongsTo(models.Unit, { foreignKey: 'unit' });
    }
}

export default Client;
