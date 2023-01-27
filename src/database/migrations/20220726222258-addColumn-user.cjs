'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('user','unit',{
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {model: 'unit', key: 'id'},
        after: 'company'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('user','unit')
    ])
  }
};

