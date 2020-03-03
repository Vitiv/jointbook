const models = require("../../../db");

const userModel = models.user;
const boughtBookModel = models.boughtBook;
const BookModel = models.book;


const addBoughtBook = async (telegramId, bookId) => {
    let user = await userModel.findOne({where: {telegramId}});
    return boughtBookModel.create({userId: user.id, bookId})
};
const getBoughtBooksByUser = async (telegramId, page, limit) => {
    let object = await userModel.findOne({
        where: {telegramId},
        include: [{model: BookModel, required: false, include: [{model: models.bookFile}, {model: models.bookImage}]}]
    });
    return {books: object.books.slice((page - 1) * limit, page * limit), pageAmount: object.books.length / limit};
};
module.exports = {addBoughtBook, getBoughtBooksByUser};