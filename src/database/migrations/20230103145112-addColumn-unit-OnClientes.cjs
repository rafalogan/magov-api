'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('clients', 'unit', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'unit', key: 'id' },
                after: 'email'
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
        return Promise.all([queryInterface.removeColumn('clients', 'unit')]);
    }
};
