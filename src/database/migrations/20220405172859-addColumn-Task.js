'use strict';

const { isAfter } = require("date-fns");

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('task','user',{
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'user', key: 'id'},
      after: 'end'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('task','user')
    ])
  }
};
