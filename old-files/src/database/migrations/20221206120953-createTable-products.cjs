'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('product', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            value: {
                type: Sequelize.DECIMAL(16, 2),
                allowNull: true
            },
            due_date: {
                allowNull: true,
                type: Sequelize.DATE
            },
            contract: {
                type: Sequelize.STRING,
                allowNull: true
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

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('product');
    }
};
