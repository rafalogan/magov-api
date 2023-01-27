'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('demand','favorite',{
        allowNull: true,
        type: Sequelize.INTEGER,
        after: 'deadline',
        defaultValue: false
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('demand','favorite')
    ])
  }
};

