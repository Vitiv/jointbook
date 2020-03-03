const models = require("../../../db");
const bookFileModel = models.bookFile;

const addFilePath = async (bookId, imagePathArray) => {
    let objects = [];
    imagePathArray.forEach(path => objects.push({bookId, path}));

    return bookFileModel.bulkCreate(objects);
};

const removeFilePath = async (imagePathArray) => {
    return bookFileModel.destroy({where: {path: imagePathArray}})
};

const getByBookId = async (bookId) => {
    return bookFileModel.findAll({where: {bookId}})
};

module.exports = {addFilePath, removeFilePath, getByBookId};