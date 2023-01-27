'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','committed',{
        allowNull: true,
        type: Sequelize.INTEGER,
        after: 'title'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','committed')
    ])
  }
};

