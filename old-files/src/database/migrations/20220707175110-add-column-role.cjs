'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('role', 'active', {
        defaultValue: true,
        type: Sequelize.INTEGER,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('role', 'active')
    ])
  }
};

