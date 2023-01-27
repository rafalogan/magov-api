'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_revenue', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proposition: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'proposition', key: 'id'},
      },
      revenue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'revenue', key: 'id'},
      },
      active: {
        type: Sequelize.INTEGER,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('proposition_revenue');
  }
};
