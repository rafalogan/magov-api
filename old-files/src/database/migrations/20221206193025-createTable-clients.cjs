'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('clients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name_cabinet: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            contact: {
                type: Sequelize.STRING,
                allowNull: true
            },
            cnpj: {
                type: Sequelize.STRING,
                allowNull: true
            },
            cep: {
                type: Sequelize.STRING,
                allowNull: true
            },
            city: {
                type: Sequelize.STRING,
                allowNull: true
            },
            district: {
                type: Sequelize.STRING,
                allowNull: true
            },
            street: {
                type: Sequelize.STRING,
                allowNull: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            number: {
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('clients');
    }
};
