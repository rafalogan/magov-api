'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('expense_payment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expense: {
        type: Sequelize.INTEGER,
        references: { model: 'expense', key: 'id' },
        allowNull: false
      },
      payment_form: {
        type: Sequelize.INTEGER,
        references: { model: 'payment_form', key: 'id' },
        allowNull: false
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
    return queryInterface.dropTable('expense_payment');
  }
};
