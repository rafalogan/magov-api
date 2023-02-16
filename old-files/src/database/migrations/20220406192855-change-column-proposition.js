'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.changeColumn('proposition','responsible',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'physical_person', key: 'id'}
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('proposition','responsible')
    ])
  }
};
