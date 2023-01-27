'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('task','created_by',{
        allowNull: true,
        references: { model: 'user', key: 'id'},
        type: Sequelize.INTEGER,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('task','created_by')
    ])
  }
};
