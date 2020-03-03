const models = require("../../../db");
const authorImageModel = models.authorImage;

const addImagePath = async (authorId, imagePathArray) => {
    let objects = [];
    imagePathArray.forEach(path => objects.push({authorId, path}));

    return authorImageModel.bulkCreate(objects);
};

const removeImagePath = async (imagePathArray) => {
    return authorImageModel.destroy({where: {path: imagePathArray}})
};
module.exports = {addImagePath, removeImagePath};