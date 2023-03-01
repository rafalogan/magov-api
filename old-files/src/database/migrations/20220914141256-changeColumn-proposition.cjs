'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('proposition', 'menu', {
        type: Sequelize.STRING(5000),
        allowNull: false,
        after: `title`
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('proposition', 'menu')
    ])
  }
};
