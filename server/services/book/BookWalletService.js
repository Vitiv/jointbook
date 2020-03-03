const models = require('../../../db');
const walletModel = models.bookWallet;

const createWallet = async (mnemonic, bookId) => {
    return walletModel.create({mnemonic, bookId})
};
const getWalletById = async (id) => {
    return walletModel.findOne({where: {id}});
};
const getAllWallets = async () => {
    return walletModel.findAll({where: {}});
};
const getWalletByBookId = async (bookId) => {
    return walletModel.findOne({where: {bookId}});
};
module.exports = {createWallet, getWalletById, getAllWallets, getWalletByBookId};
