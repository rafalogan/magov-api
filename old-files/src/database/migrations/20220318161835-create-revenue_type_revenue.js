'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('revenue_type_revenue', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      revenue: {
        type: Sequelize.INTEGER,
        references: { model: 'revenue', key: 'id' },
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        references: { model: 'revenue_type', key: 'id' },
        allowNull: false
      },
      active: {
        type: Sequelize.INTEGER,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('revenue_type_revenue');
  }
};
