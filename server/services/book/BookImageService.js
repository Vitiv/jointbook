const models = require("../../../db");
const bookImageModel = models.bookImage;

const addImagePath = async (bookId, imagePathArray) => {
    let objects = [];
    imagePathArray.forEach(path => objects.push({bookId, path}));

    return bookImageModel.bulkCreate(objects);
};

const removeImagePath = async (imagePathArray) => {
    return bookImageModel.destroy({where: {path: imagePathArray}});
};
const getByBookId = async (bookId) => {
    return bookImageModel.findAll({where: {bookId}});
};
module.exports = {addImagePath, removeImagePath, getByBookId};