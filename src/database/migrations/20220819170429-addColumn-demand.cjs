'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('demand','created_by',{
        allowNull: true,
        references: { model: 'user', key: 'id'},
        type: Sequelize.INTEGER,
        after:'plaintiff'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('demand','created_by')
    ])
  }
};
