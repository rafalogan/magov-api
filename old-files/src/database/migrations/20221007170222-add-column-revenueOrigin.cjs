'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('revenue_origin','expense',{
        allowNull: true,
        references: { model: 'expense', key: 'id' },
        type: Sequelize.INTEGER,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('revenue_origin','expense')
    ])
  }
};

