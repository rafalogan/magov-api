import Sequelize, { Model } from 'sequelize';

class Seller extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                cpf_vendedor: Sequelize.STRING,
                commission: Sequelize.DECIMAL,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'seller'
            }
        );
        return this;
    }
}

export default Seller;
