'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('demand_goal', {
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
      goal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'goal', key: 'id'},
      },
      active: {
        type: Sequelize.INTEGER,
        default: true,
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
    return queryInterface.dropTable('demand_goal')
  }
};
