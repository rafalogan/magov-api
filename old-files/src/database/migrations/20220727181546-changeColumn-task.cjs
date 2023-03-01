'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task', 'cost', {
        allowNull: true,
        type: Sequelize.FLOAT,
        after: `description`
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task', 'cost')
    ])
  }
};
