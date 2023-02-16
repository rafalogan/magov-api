'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('revenue', 'value', {
        allowNull: true,
        type: Sequelize.DECIMAL(16,2),
        after: `document_url`
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('revenue', 'value')
    ])
  }
};
