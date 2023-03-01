'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('seller', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            cpf_vendedor: {
                type: Sequelize.STRING,
                allowNull: true
            },
            contact: {
                type: Sequelize.STRING,
                allowNull: true
            },
            commission: {
                type: Sequelize.DECIMAL(16, 2),
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
        return queryInterface.dropTable('seller');
    }
};
