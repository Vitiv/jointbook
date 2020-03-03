const minterService = require('../server/services/MinterService');
const bookWalletService = require('../server/services/book/BookWalletService');

module.exports = async () => {
    let allWallets = await bookWalletService.getAllWallets();
    let walletsWithBalances = await Promise.all(allWallets.map(async wallet => {
        let resultObject = wallet;
        resultObject.balance = await minterService.readBalance(resultObject.mnemonic);
        return resultObject;
    }));

    walletsWithBalances.forEach(async wallet => {
        wallet.balance.balance > 5 ? minterService.sendFromWalletToMain(wallet.mnemonic, wallet.balance.balance - 0.035) : {};
    });
};