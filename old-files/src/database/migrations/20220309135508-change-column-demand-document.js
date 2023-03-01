'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.changeColumn('demand_document', 'demand', {
      allowNull: false,
      type: Sequelize.INTEGER
     }),
     queryInterface.changeColumn('demand_document', 'url', {
      allowNull: false, 
      type: Sequelize.STRING
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.changeColumn('demand_document', 'demand'),
     queryInterface.changeColumn('demand_document', 'url')
   ])
  }
};
