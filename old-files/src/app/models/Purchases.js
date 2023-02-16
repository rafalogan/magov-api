import Sequelize, { Model } from 'sequelize';

class Purchases extends Model {
    static init(sequelize) {
        super.init(
            {
                product: Sequelize.INTEGER,
                status_payment: Sequelize.INTEGER,
                seller: Sequelize.INTEGER,
                payment_method: Sequelize.INTEGER,
                client: Sequelize.INTEGER,
                status_commission: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'purchases'
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Seller, { as: 'sellers', foreignKey: 'seller' });

        this.belongsTo(models.Product, {
            as: 'products',
            foreignKey: 'product'
        });

        this.belongsTo(models.PaymentStatus, {
            as: 'paymentStatus',
            foreignKey: 'status_payment'
        });

        this.belongsTo(models.PaymentMethods, {
            as: 'paymentMethod',
            foreignKey: 'payment_method'
        });

        this.belongsTo(models.Client, {
            as: 'buyerCustomer',
            foreignKey: 'client'
        });

        this.belongsTo(models.CommissionStatus, {
            as: 'statusCommission',
            foreignKey: 'status_commission'
        });
    }
}

export default Purchases;
