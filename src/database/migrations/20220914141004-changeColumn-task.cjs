'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task', 'description', {
        type: Sequelize.STRING(5000),
        allowNull: false,
        after: `title`
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task', 'description')
    ])
  }
};
