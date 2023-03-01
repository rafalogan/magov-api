'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','favorite',{
        allowNull: true,
        type: Sequelize.INTEGER,
        after: 'committed'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','favorite')
    ])
  }
};

