'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_keyword', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      proposition: {
        allowNull: false,
        references: { model: 'proposition', key: 'id'},
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.INTEGER,
        default: true,
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
    return queryInterface.dropTable('proposition_keyword')
  }
};
