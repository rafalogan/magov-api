'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','created_by',{
        allowNull: true,
        references: { model: 'user', key: 'id'},
        type: Sequelize.INTEGER,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','created_by')
    ])
  }
};
