'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('proposition','expense',{
        allowNull: true,
        references: { model: 'expense', key: 'id' },
        type: Sequelize.INTEGER,
        after:'deadline'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('proposition','expense')
    ])
  }
};

