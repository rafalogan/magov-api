'use strict';

const { isAfter } = require("date-fns");

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('demand','status',{
      type: Sequelize.INTEGER,
      defaultValue: 0,

     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('demand','status')
    ])
  }
};
