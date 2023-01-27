'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_document', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      proposition: {
        type: Sequelize.INTEGER,
        references: { model: 'proposition', key: 'id'},
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('proposition_document')
  }
};
