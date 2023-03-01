'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("task", "title", {
        allowNull: true,
        type: Sequelize.STRING,
        after: `id`
      }),
      queryInterface.addColumn("task", "cost", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: `description`
      }),
      queryInterface.addColumn("task", "theme", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'theme', key: 'id'},
        after: `description`
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("task", "title"),
      queryInterface.removeColumn("task", "cost"),
      queryInterface.removeColumn("task", "theme")
    ]);
  }
};
