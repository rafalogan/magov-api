'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('purchases', 'client', {
                type: Sequelize.INTEGER,
                references: { model: 'clients', key: 'id' },
                allowNull: true
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('purchases', 'client')
        ]);
    }
};
