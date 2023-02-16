'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('revenue_receipt_form', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      revenue: {
        allowNull: false,
        references: { model: 'revenue', key: 'id'},
        type: Sequelize.INTEGER
      },
      receipt_form: {
        allowNull: false,
        references: { model: 'receipt_form', key: 'id'},
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
    return queryInterface.dropTable('revenue_receipt_form')
  }
};
