'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_demand', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      proposition: {
        allowNull: false,
        references: { model: 'proposition', key: 'id' },
        type: Sequelize.INTEGER
      },
      demand: {
        allowNull: false,
        references: { model: 'demand', key: 'id' },
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('proposition_demand')
  }
};
