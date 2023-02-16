'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('user', 'physical_person', {
                references: { model: 'physical_person', key: 'id' },
                allowNull: true,
                type: Sequelize.INTEGER
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('user', 'physical_person')
        ]);
    }
};
