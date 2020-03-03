const userService = require('../server/services/user/UserService');
const authorService = require('../server/services/author/AuthorService');
const bookService = require('../server/services/book/BookService');
const boughtBookService = require('../server/services/book/BoughtBookService');
const billService = require('../server/services/BillService');
const bookFileService = require('../server/services/book/BookFileService');
const minterService = require('../server/services/MinterService');
const userWalletService = require('../server/services/user/UserWalletService');
const bookWalletService = require('../server/services/book/BookWalletService');
const qiwiService = require('../server/services/QiwiService');

const config = require('config');

const addUser = async (id) => {
    const [user, walletMnemonic] = await Promise.all([userService.createUser(id), minterService.generateWallet()]);
    const walletModel = await userWalletService.createWallet(walletMnemonic, user.id);

    return user;
};
const getAuthors = async (page) => {
    return authorService.getAuthors(page, config.get('amountAuthorsPerPageTelegram'));
};
const getBoughtBooks = async (telegramId, page) => {
    return boughtBookService.getBoughtBooksByUser(telegramId, page, config.get('amountBooksPerPageTelegram'));
};
const getBooks = async (page, telegramId) => {
    return bookService.getBooksWithConnectedDataAndUser(page, config.get('amountBooksPerPageTelegram'), telegramId);
};
const setUserLanguage = async (telegramId, language) => {
    return userService.setLanguageByTelegramId(telegramId, language);
};
const getUserData = async (telegramId) => {
    return userService.findUserByTelegramId(telegramId);
};
const getBookPagesAmount = async () => {
    return ((await bookService.getBooksAmount()) / config.get('amountBooksPerPageTelegram'));
};
const getAuthorsPagesAmount = async () => {
    return ((await authorService.getAuthorsAmount()) / config.get('amountAuthorsPerPageTelegram'));
};
const getAuthorsBooks = async (authorId, page, telegramId) => {
    return authorService.getAuthorByIdWithBookPaginationAndUser(authorId, page, config.get('amountBooksPerPageTelegram'), telegramId);
};
const getAuthorBooksPagesAmount = async (authorId) => {
    return ((await bookService.getBookAmountByAuthor(authorId)) / config.get('amountBooksPerPageTelegram'));
};
const getFilesByBookId = async (bookId) => {
    return bookFileService.getByBookId(bookId);
};
const buyBook = async (bookId, telegramId) => {
    let [book, user] = await Promise.all([bookService.getBookDataById(bookId), userService.findUserByTelegramId(telegramId)]);
    let [bookWallet, userWallet] = await Promise.all([bookWalletService.getWalletByBookId(book.id), userWalletService.getWalletByUserId(user.id)]);
    let userBalance = await minterService.readBalance(userWallet.mnemonic);

    if (userBalance < book.cost) {
        return false;
    } else {
        await minterService.sendFromWalletToWallet(userWallet.mnemonic, bookWallet.mnemonic, book.cost - 0.034);
        await boughtBookService.addBoughtBook(telegramId, bookId);

        return true;
    }
};
const getBalance = async (telegramId) => {
    const user = (await userService.findUserByTelegramId(telegramId));
    const wallet = await userWalletService.getWalletByUserId(user.id);

    const balanceInfo = await minterService.readBalance(wallet.mnemonic);

    return {
        balance: balanceInfo.balance,
        addressString: balanceInfo.addressString
    };
};
const isEnoughMoney = async (amount) => {
    let [moneyAmount, bills] = await Promise.all([
        minterService.readBalance(config.get('mainWalletMnemonic')),
        billService.getBillsCreatedLater(new Date(new Date().getTime() - config.get('billDurationMillis')))
    ]);

    return moneyAmount.balance > bills.map(bill => bill.amount).reduce((acc, cur) => acc + cur + 0.034, 0) + parseInt(amount) + 0.034;
};

const isBillNotExists = async (id) => {
    let bill = await billService.getBillsByUserIdAndCreatedLater(new Date(new Date() - config.get('billDurationMillis')), id);

    return bill;
};

const getRechargeLink = async (bitsAmount, telegramId) => {
    const user = await userService.findUserByTelegramId(telegramId);
    const amount = bitsAmount * config.get('bipRate');

    let bill = await isBillNotExists(user.id);

    if (!bill) {
        if (await isEnoughMoney(bitsAmount)) {
            let billId = String(Math.floor(Math.random() * (10 ** 16)));

            let link = await qiwiService.createPaymentLinkForCustomer(billId, amount, 'Пополнение счета', user.id, bitsAmount);
            if (link.errorCode) {
                return null;
            }
            await billService.createBill(billId, bitsAmount, user.id, link.payUrl);

            return link;
        } else {
            throw new Error('money problem');
        }
    } else {
        throw new Error(bill.link);
    }
};
const getBookWithAuthorAndUser = async (bookId, telegramId) => {
    return bookService.getBookByIdWithConnectedDataAndUser(bookId, telegramId);
};
const getAddressByMnemonic = async (mnemonic) => {
    let wallet = await minterService.getWallet(mnemonic);

    return wallet.getAddressString();
};
module.exports = {
    addUser,
    getAuthors,
    getBoughtBooks,
    getBooks,
    setUserLanguage,
    getUserData,
    getBookPagesAmount,
    getAuthorsPagesAmount,
    getAuthorsBooks,
    getAuthorBooksPagesAmount,
    getFilesByBookId,
    buyBook,
    getBalance,
    getRechargeLink,
    getBookWithAuthorAndUser,
    getAddressByMnemonic
};