'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposition_related', {
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
      related: {
        type: Sequelize.INTEGER,
        references: { model: 'proposition', key: 'id'},
        allowNull: false,
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
    return queryInterface.dropTable('proposition_related')
  }
};
