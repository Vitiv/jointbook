const Sequelize = require("sequelize");
const config = require("config");

const languages = config.get("languages");

module.exports = (sequelize) => {
    const User = sequelize.define(
        "user",
        {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            telegramId: {
                type: Sequelize.INTEGER,
                unique: true,
            },
            language: {
                type: Sequelize.TEXT,
                validate: {
                    isIn: [languages]
                }
            },
        }
    );



    return User;
};