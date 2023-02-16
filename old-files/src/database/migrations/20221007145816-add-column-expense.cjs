'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('expense','unit',{
        allowNull: true,
        references: { model: 'unit', key: 'id' },
        type: Sequelize.INTEGER,
        after:'quantity'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('expense','unit')
    ])
  }
};

