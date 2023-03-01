"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("doc_modelo", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true
            },
            html: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
            proposition: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "proposition", key: "id" }
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
        return queryInterface.dropTable("doc_modelo");
    }
};
