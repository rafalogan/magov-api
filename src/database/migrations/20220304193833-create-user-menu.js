'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menu: {
        type: Sequelize.INTEGER,
        references: { model: 'menu', key: 'id' },
        allowNull: false
      },
      user: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        allowNull: false
      },
      permission_read: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false
      },
      permission_write: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false
      },
      permission_delete: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false
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
    return queryInterface.dropTable('user_menu');
  }
};