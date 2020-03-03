const Sequelize = require('sequelize');

module.exports = (sequelize, Book) => {
    const BookWallet = sequelize.define(
        'book_wallet',
        {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            mnemonic: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            bookId: {
                type: Sequelize.INTEGER,
                references: {
                    model: Book,
                    key: 'id'
                },
                allowNull: false
            }
        }
    );

    Book.hasOne(BookWallet);
    BookWallet.belongsTo(Book, {
        foreignKey: 'bookId'
    });

    return BookWallet;
};