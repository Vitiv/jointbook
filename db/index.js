const Sequelize = require("sequelize");
const config = require("config");
const dbConfig = config.get("dbConfig");

const UserWallet = require('./modules/UserWallet');
const BookWallet = require('./modules/BookWallet');
const User = require("./modules/User");
const Author = require("./modules/Author");
const AuthorImage = require("./modules/AuthorImage");
const Book = require("./modules/Book");
const BookImage = require("./modules/BookImage");
const BookFile = require("./modules/BookFile");
const BoughtBook = require("./modules/BoughtBook");
const Bill = require("./modules/Bill");

const sequelize = new Sequelize(
    dbConfig.dbName,
    dbConfig.userName,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        ssl: true,
        logging: false
    },
);

const user = User(sequelize);
const bill = Bill(sequelize, user);
const userWallet = UserWallet(sequelize, user);
const author = Author(sequelize);
const authorImage = AuthorImage(sequelize, author);
const book = Book(sequelize, author);
const bookWallet = BookWallet(sequelize, book);
const bookImage = BookImage(sequelize, book);
const bookFile = BookFile(sequelize, book);
const boughtBook = BoughtBook(sequelize, book, user);

sequelize.sync({
    alter: true
});

module.exports = {userWallet, user, author, authorImage, book, bookImage, bookFile, boughtBook, bookWallet, bill};
