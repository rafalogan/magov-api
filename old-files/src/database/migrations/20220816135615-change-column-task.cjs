'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task', 'cost', {
        allowNull: true,
        type: Sequelize.DECIMAL(16,2),
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
