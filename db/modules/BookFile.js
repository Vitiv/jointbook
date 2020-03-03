const Sequelize = require("sequelize");

module.exports = (sequelize, Book) => {
    const BookFile = sequelize.define(
    "book_file",
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

    Book.hasMany(BookFile);
    BookFile.belongsTo(Book, {
        foreignKey: "bookId"
    });

    return BookFile;
};