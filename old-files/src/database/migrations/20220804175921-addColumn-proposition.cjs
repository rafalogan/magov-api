'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','revenue',{
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {model: 'revenue', key: 'id'},
        after: 'committed'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','revenue')
    ])
  }
};

