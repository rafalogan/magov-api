'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('state_capag', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uf: {
        type: Sequelize.STRING
      },
      ind_1: {
        type: Sequelize.FLOAT
      },
      ind_2: {
        type: Sequelize.FLOAT
      },
      ind_3: {
        type: Sequelize.FLOAT
      },
      grade_capag: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('state_capag');
  }
};