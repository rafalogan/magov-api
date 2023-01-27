import Sequelize, { Model } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
                value: Sequelize.DECIMAL,
                amount: Sequelize.INTEGER,
                due_date: Sequelize.DATE,
                contract: Sequelize.STRING,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'product'
            }
        );
        return this;
    }
}

export default Product;
