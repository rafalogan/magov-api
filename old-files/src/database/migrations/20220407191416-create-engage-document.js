'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('engage_document', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            data: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            flg_existe_documento_relacionado_no_d_m: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            fase: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            documento: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            documento_resumido: {
                allowNull: true,
                type: Sequelize.STRING
            },
            especie: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            orgao_superior: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            orgao_vinculado: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            unidade_gestora: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            elemento_despesa: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            favorecido: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            valor: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            revenue: {
                references: {
                    model: 'revenue',
                    key: 'id'
                },
                allowNull: true,
                type: Sequelize.INTEGER
            },
            active: {
                type: Sequelize.INTEGER,
                defaultValue: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('engage_document')
    }
};
