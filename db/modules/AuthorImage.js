const Sequelize = require("sequelize");

module.exports = (sequelize, Author) => {
    const AuthorImage = sequelize.define(
    "author_image",
    {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        path: {
            type: Sequelize.TEXT
        },
        authorId: {
            type: Sequelize.INTEGER,
            references: {
                model: Author,
                key: "id"
            }
        }
    });

    Author.hasMany(AuthorImage);

    return AuthorImage;
};