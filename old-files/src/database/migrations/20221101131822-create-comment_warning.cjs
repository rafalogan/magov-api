"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("comment_warning", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            task: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "task", key: "id" }
            },
            comment: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable("comment_warning");
    }
};
