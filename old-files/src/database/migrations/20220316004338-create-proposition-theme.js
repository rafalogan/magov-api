'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_theme', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proposition: {
        allowNull: false,
        references: { model: 'proposition', key: 'id' },
        type: Sequelize.INTEGER
      },
      theme: {
        allowNull: false,
        references: { model: 'theme', key: 'id' },
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('proposition_theme');
  }
};
