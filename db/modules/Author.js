const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    const Author = sequelize.define(
    "author",
    {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }
    );

    return Author;
};