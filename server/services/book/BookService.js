const models = require("../../../db");
const bookModel = models.book;

const createBook = async (authorId, name, description, cost) => {
    return bookModel.create({name, authorId, description, cost});
};
const deleteBook = async (id) => {
    return bookModel.destroy({where: {id}});
};
const updateBook = async (id, name, description, cost) => {
    return bookModel.updateOne({name, description, cost}, {where: {id}});
};
const getBooks   = async (page, limit) => {
    return bookModel.findAll({where: {}, limit, offset: (page - 1) * limit, order: [["id", "DESC"]]});
};
const getBooksWithConnectedData = async (page, limit) => {
    return bookModel.findAll({where: {}, order: [["id", "DESC"]], limit, offset: (page - 1) * limit, include: [{model: models.author}, {model: models.bookImage, required: false}, {model: models.bookFile, required: false}]});
};
const getBooksAmount = async () => {
    return bookModel.count({});
};
const getBooksWithConnectedDataAndUser = async (page, limit, telegramId) => {
    return bookModel.findAll({where: {}, order: [["id", "DESC"]], limit, offset: (page - 1) * limit, include: [{model: models.author}, {model: models.bookImage, required: false}, {model: models.bookFile, required: false}, {model: models.user, required:false, where: {telegramId}}]});
};
const getBookAmountByAuthor = async (authorId) => {
    return bookModel.count({where: {authorId}});
};
const getBookDataById = async (id) => {
    return bookModel.findOne({where: {id}, include: [{model: models.author}, {model: models.bookImage, required: false}, {model: models.bookFile, required: false}]});
};
const getBookByIdWithConnectedDataAndUser = async (id, telegramId) => {
    return bookModel.findAll({where: {id}, order: [["id", "DESC"]], include: [{model: models.author}, {model: models.bookImage, required: false}, {model: models.bookFile, required: false}, {model: models.user, required:false, where: {telegramId}}]});
};
module.exports = {createBook, deleteBook, updateBook, getBooks, getBooksWithConnectedData, getBooksAmount, getBooksWithConnectedDataAndUser, getBookAmountByAuthor, getBookDataById, getBookByIdWithConnectedDataAndUser};