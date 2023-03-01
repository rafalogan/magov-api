'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('task_plaintiff', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      task: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'task', key: 'id'},
      },
      plaintiff: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'plaintiff', key: 'id'},
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
    return queryInterface.dropTable('task_plaintiff');
  }
};
