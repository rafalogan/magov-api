'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('plaintiff','note',{
        allowNull: true,
        type: Sequelize.STRING,
     }),
     queryInterface.addColumn('plaintiff','institute_representative',{
        allowNull: true,
        type: Sequelize.STRING,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('plaintiff','note', ),
      queryInterface.removeColumn('plaintiff','institute_representative')
    ])
  }
};
