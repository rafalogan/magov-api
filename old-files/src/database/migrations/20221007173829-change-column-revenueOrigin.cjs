'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('revenue_origin', 'revenue', {
        references: { model: 'revenue', key: 'id'},
        allowNull: true,
        type: Sequelize.INTEGER
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('revenue_origin', 'revenue')
    ])
  }
};
