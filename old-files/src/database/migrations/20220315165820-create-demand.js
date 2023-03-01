'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('demand', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      responsible: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'physical_person', key: 'id'},
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plaintiff: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'plaintiff', key: 'id'},
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
    return queryInterface.dropTable('demand');
  }
};
