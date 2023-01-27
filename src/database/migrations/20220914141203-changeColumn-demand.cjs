'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('demand', 'description', {
        type: Sequelize.STRING(5000),
        allowNull: false,
        after: `name`
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('demand', 'description')
    ])
  }
};
