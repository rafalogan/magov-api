
'use strict';


module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('expense_company', {

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

      company: {
        type: Sequelize.INTEGER,
        references: { model: 'company', key: 'id' },
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

    return queryInterface.dropTable('expense_company');
  }
};
