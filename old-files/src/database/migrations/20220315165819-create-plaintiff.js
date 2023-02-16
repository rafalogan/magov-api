'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plaintiff', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      person: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'person', key: 'id'},
      },
      institute_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'institute_type', key: 'id'},
      },
      institute_person: {
        type: Sequelize.STRING,
      },
      relationship_type: {
        type: Sequelize.STRING,
      },
      relatives: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plaintiff')
  }
};
