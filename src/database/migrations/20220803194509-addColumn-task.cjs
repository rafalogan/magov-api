'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('task','unit',{
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {model: 'unit', key: 'id'},
        after: 'cost'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('task','unit')
    ])
  }
};

