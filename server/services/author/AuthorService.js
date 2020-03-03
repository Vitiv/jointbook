const models = require("../../../db");
const authorModel = models.author;

const createAuthor = async (name) => {
    return authorModel.create({name});
};
const deleteAuthor = async (id) => {
    return authorModel.destroy({where: {id}});
};
const updateAuthor = async (id, name) => {
    return authorModel.updateOne({name}, {where: {id}});
};
const getAuthors = async (page, limit) => {
    return authorModel.findAll({where: {}, limit, offset: (page - 1) * limit, order: [["id", "DESC"]]});
};
const getAuthorByIdWithBookPagination = async (id, page, limit) => {
    return authorModel.findOne({
        where: {id},
        include: [{model: models.book, required: false, limit, offset: (page - 1) * limit, order: [["id", "DESC"]], include: [{model: models.bookImage, required: false}, {model: models.bookFile, required: false}]}]
    })
};
const getAuthorByIdWithBookPaginationAndUser = async (id, page, limit, telegramId) => {
    return authorModel.findOne({
        where: {id},
        include: [{model: models.book, required: false, limit, offset: (page - 1) * limit, order: [["id", "DESC"]], include: [{model: models.bookImage, required: false}, {model: models.bookFile, required: false}, {model: models.user, required: false, where: {telegramId}}]}]
    })
};

const getAuthorsAmount = async () => {
    return authorModel.count({});
};
module.exports = {createAuthor, deleteAuthor, updateAuthor, getAuthors, getAuthorByIdWithBookPagination, getAuthorsAmount, getAuthorByIdWithBookPaginationAndUser};