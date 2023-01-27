'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('proposition', 'unit', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'unit', key: 'id' },
                after: 'active'
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('proposition', 'unit')
        ]);
    }
};
