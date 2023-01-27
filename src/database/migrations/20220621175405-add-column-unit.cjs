'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('unit','contact',{
        allowNull: true,
        references: { model: 'contact', key: 'id' },
        type: Sequelize.INTEGER,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('unit','contact')
    ])
  }
};

