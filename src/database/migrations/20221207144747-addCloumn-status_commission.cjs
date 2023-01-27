'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('purchases', 'status_commission', {
                type: Sequelize.INTEGER,
                references: { model: 'commission_status', key: 'id' },
                allowNull: true
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('purchases', 'status_commission')
        ]);
    }
};
