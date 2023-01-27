'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.changeColumn('contact','phone',{
      type: Sequelize.STRING,
      allowNull: false,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('contact','phone')
    ])
  }
};
