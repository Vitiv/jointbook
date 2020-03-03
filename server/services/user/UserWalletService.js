const models = require('../../../db');
const walletModel = models.userWallet;

const createWallet = async (mnemonic, userId) => {
    return walletModel.create({mnemonic, userId})
};
const getWalletById = async (id) => {
    return walletModel.findOne({where: {id}});
};
const getAllWallets = async () => {
    return walletModel.findAll({where: {}});
};
const getWalletByUserId = async (userId) => {
    return walletModel.findOne({where: {userId}});
};
module.exports = {createWallet, getWalletById, getAllWallets, getWalletByUserId};
