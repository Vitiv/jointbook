const Sequelize = require("sequelize");

module.exports = (sequelize, Author, Wallet) => {
    const Book = sequelize.define(
    "book",
    {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        authorId: {
            type: Sequelize.INTEGER,
            references: {
                model: Author,
                key: "id"
            },
            allowNull: false
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false

        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        cost: {
            type: Sequelize.REAL,
            min: 0,
            validate: {},
            allowNull: false
        },
    }
    );

    Author.hasMany(Book);
    Book.belongsTo(Author, {
        foreignKey: "authorId"
    });


    return Book;
};