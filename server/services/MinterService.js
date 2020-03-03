const minterjsWallet = require('minterjs-wallet');
const fetch = require('node-fetch');
const minterjssdk = require('minter-js-sdk');
const mainWalletMnemonic = require('config').get('mainWalletMnemonic');

const generateWallet = async () => {
    const wallet = await minterjsWallet.generateWallet();

    return wallet.getMnemonic();
};
const getWallet = async (mnemonic) => {
    return minterjsWallet.walletFromMnemonic(mnemonic);
};
const readBalance = async (mnemonic) => {
    const wallet = await getWallet(mnemonic);
    const addressString = wallet.getAddressString();

    let res = await fetch(`https://explorer-api.apps.minter.network/api/v1/addresses/${addressString}`);
    res = (await res.json()).data;

    return {
        balance: res.balances.find(element => element.coin === 'BIP').amount,
        addressString: res.address
    };
};
const sendBits = async (idSender, addressReceiver, amount) => {
    const minter = new minterjssdk.Minter({apiType: 'node', baseURL: 'http://api.minter.one'});
    const txParams = new minterjssdk.MultisendTxParams({
        privateKey: idSender,
        chainId: 1,
        list: [
            {
                value: amount,
                coin: 'BIP',
                to: addressReceiver
            }
        ],
        feeCoinSymbol: 'BIP',
        message: 'test message',
    });

    return minter.postTx(txParams);
};
const sendFromMainToWallet = async (mnemonic, amount) => {
    let [toWallet, fromWallet] = await Promise.all([getWallet(mnemonic), getWallet(mainWalletMnemonic)]);

    return sendBits(fromWallet.getPrivateKeyString(), toWallet.getAddressString(), amount);
};
const sendFromWalletToWallet = async (mnemonicFrom, mnemonicTo, amount) => {
    let [toWallet, fromWallet] = await Promise.all([getWallet(mnemonicTo), getWallet(mnemonicFrom)]);

    return sendBits(fromWallet.getPrivateKeyString(), toWallet.getAddressString(), amount);
};
const sendFromWalletToMain = async (mnemonic, amount) => {
    let [toWallet, fromWallet] = await Promise.all([getWallet(mainWalletMnemonic), getWallet(mnemonic)]);

    return sendBits(fromWallet.getPrivateKeyString(), toWallet.getAddressString(), amount);
};


module.exports = {
    generateWallet,
    getWallet,
    readBalance,
    sendFromMainToWallet,
    sendFromWalletToMain,
    sendFromWalletToWallet
};