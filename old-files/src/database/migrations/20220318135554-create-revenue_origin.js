'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('revenue_origin', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      revenue: {
        references: { model: 'revenue', key: 'id'},
        allowNull: true,
        type: Sequelize.INTEGER
      },
      origin: {
        allowNull: false,
        references: { model: 'origin', key: 'id'},
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
    return queryInterface.dropTable('revenue_origin')
  }
};
