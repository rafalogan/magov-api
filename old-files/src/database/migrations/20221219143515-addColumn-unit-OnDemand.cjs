'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('demand', 'unit', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'unit', key: 'id' }
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
        return Promise.all([queryInterface.removeColumn('demand', 'unit')]);
    }
};
