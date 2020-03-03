const models = require("../../../db");
const userModel = models.user;

const createUser = async (telegramId) => {
    return userModel.create({telegramId});
};
const setLanguageByTelegramId = async (telegramId, language) => {
    return userModel.update({language}, {where: {telegramId}});
};
const findUserByTelegramId = async (telegramId) => {
    return userModel.findOne({where: {telegramId}});
};
const findUserById = async (id) => {
    return userModel.findOne({where:{id}});
};
module.exports = {createUser, setLanguageByTelegramId, findUserByTelegramId, findUserById};