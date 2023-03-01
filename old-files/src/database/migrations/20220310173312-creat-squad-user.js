'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('squad_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      squad: {
        type: Sequelize.INTEGER,
        references: { model: 'squad', key: 'id' },
        allowNull: false
      },
      uesr: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
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
    return queryInterface.dropTable('squad_user');
  }
};