'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('city_capag', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ibge_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      population : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ind_1: {
        type: Sequelize.DECIMAL(15,8),
        allowNull: false,
      },
      grade_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ind_2: {
        type: Sequelize.DECIMAL(15,8),
        allowNull: false,
      },
      grade_2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ind_3: {
        type: Sequelize.DECIMAL(15,8),
        allowNull: false,
      },
      grade_3: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade_capag: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('city_capag');
  }
};