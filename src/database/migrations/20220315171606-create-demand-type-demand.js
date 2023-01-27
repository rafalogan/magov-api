'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('demand_type_demand', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      demand: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'demand', key: 'id'},
      },
      demand_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'demand_type', key: 'id'},
      },
      active: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('demand_type_demand');
  }
};
