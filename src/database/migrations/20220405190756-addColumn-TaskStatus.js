'use strict';

const { isAfter } = require("date-fns");

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('task','status',{
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: 'user'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('task','status')
    ])
  }
};
