const Sequelize = require("sequelize");

module.exports = (sequelize, Book) => {
    const BookImage = sequelize.define(
    "book_image",
    {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        path: {
            type: Sequelize.TEXT
        },
        bookId: {
            type: Sequelize.INTEGER,
            references: {
                model: Book,
                key: "id"
            }
        }
    });

    Book.hasMany(BookImage);
    BookImage.belongsTo(Book, {
        foreignKey: "bookId"
    });

    return BookImage;
};