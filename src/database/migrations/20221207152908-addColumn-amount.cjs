'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('product', 'amount', {
                type: Sequelize.INTEGER,
                allowNull: true,
                after: 'value'
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.removeColumn('product', 'amount')]);
    }
};
