const Sequelize = require("sequelize");

module.exports = (sequelize, Book, User) => {
    const BoughtBook = sequelize.define(
    "bought_book",
    {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        bookId: {
            type: Sequelize.INTEGER,
            references: {
                model: Book,
                key: "id"
            },
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: "id"
            },
        }
    });

    Book.belongsToMany(User, {through: BoughtBook});
    User.belongsToMany(Book, {through: BoughtBook});

    return BoughtBook;
};