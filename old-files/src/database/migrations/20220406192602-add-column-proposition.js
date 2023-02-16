'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','responsible',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'physical_person', key: 'id'},
      defaultValue: 1
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','responsible')
    ])
  }
};
