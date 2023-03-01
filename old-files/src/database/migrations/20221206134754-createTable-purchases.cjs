'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('purchases', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            product: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'product', key: 'id' }
            },
            status_payment: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'payment_status', key: 'id' }
            },
            seller: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'seller', key: 'id' }
            },
            active: {
                type: Sequelize.INTEGER,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('purchases');
    }
};
