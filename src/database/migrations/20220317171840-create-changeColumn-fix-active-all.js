'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('proposition_document', 'active', {
                defaultValue: true,
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn('proposition_keyword', 'active', {
                defaultValue: true,
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn('proposition_goal', 'active', {
                defaultValue: true,
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn('demand_goal', 'active', {
                defaultValue: true,
                type: Sequelize.INTEGER
            }),
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('proposition_document', 'active'),
            queryInterface.changeColumn('proposition_keyword', 'active'),
            queryInterface.changeColumn('proposition_goal', 'active'),
            queryInterface.changeColumn('demand_goal', 'active'),
        ])
    }
};
