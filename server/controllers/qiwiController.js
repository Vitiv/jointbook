const qiwiService = require('../services/QiwiService');
const minterService = require('../services/MinterService');
const userWalletService = require('../services/user/UserWalletService');
const userService = require('../services/user/UserService');
const billService = require("../services/BillService");
const bot = require("../../bot/index");

const processWebhook = async (req, res, next) => {
    let isValid = await qiwiService.boolCheckPaymentValid(req.header('X-Api-Signature-SHA256'), req.body);

    if (!isValid) {
        res.send(JSON.stringify({error: 1}));
    } else {
        let data = await qiwiService.getPaymentDataFromNotification(req.body);

        if (typeof data === 'string') {
            res.send(JSON.stringify({error: 1}));
        } else {
            let [wallet, user] = await Promise.all([userWalletService.getWalletByUserId(data.id), userService.findUserById(data.id)]);

            await minterService.sendFromMainToWallet(wallet.mnemonic, data.value);
            await Promise.all([bot.sendRechargeMessage(user.language, user.telegramId, data.value), billService.deleteByBillId(req.body.bill.billId)]);

            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({error: 0}));
        }
    }
};
module.exports = {
    processWebhook
};