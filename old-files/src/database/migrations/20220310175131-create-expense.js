'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('expense', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      document_url: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      installments: {
        type: Sequelize.INTEGER
      },
      observation: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false
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
    return queryInterface.dropTable('expense');
  }
};