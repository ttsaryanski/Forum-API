"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("themes", "category_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.createTable("messages", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            author_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("themes", "category_id");
        await queryInterface.dropTable("messages");
    },
};
