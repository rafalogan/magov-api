'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('purchases', 'payment_method', {
                type: Sequelize.INTEGER,
                references: { model: 'payment_methods', key: 'id' },
                allowNull: true,
                after: 'seller'
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('purchases', 'payment_method')
        ]);
    }
};
