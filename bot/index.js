const Telegraf = require('telegraf');
const config = require('../config/debug');
const rateLimit = require('telegraf-ratelimit');
const fs = require('fs');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const botUtils = require('./../botUtils/index');
const constants = require('./constants');
const languages = [];
config.languages.forEach(language => {
    languages.push(require(`./../languages/${language}`));
});

const {sleep} = require('./stuff/index');
const {
    sendBooksMessage,
    editBooksMessage,
    sendStartMessage,
    sendSmallNavMessage,
    sendBooksButtonMessage,
    sendBackMessage,
    sendAuthorMessage,
    editAuthorMessage,
    sendFinanceMessage,
    sendWalletMessage,
    sendAboutMessage,
    sendSettingsMessage,
    editWalletMessage,
    sendBuyBookMessage,
    editBuyBookMessage
} = require('./messages/index');

const BOT_TOKEN = config.token;
const bot = new Telegraf(BOT_TOKEN);
const limitConfig = {
    window: 1000,
    limit: 75,
    onLimitExceeded: () => {
        console.log('Rate limit exceeded');
        sleep(50);
    }
};

bot.use(Telegraf.log());
bot.use(rateLimit(limitConfig));

const sendRechargeNotificationToOwner = async () => {
    return bot.telegram.sendMessage(config.ownerTelegramId,
        'Время пополнять главный кошелек' + '\n\n' +
        '<code>' + await botUtils.getAddressByMnemonic(config.mainWalletMnemonic) + '</code>',
        {parse_mode: 'HTML'}
    );
};

const sendRechargeMessage = async (userLanguage, userId, amount) => {
    let buffLang = null;
    languages.map(language => {
        const lgCode = language.settings.code.split(' ');
        if (lgCode[0].toLowerCase() === userLanguage) {
            buffLang = language;
        }
    });
    
    const message = buffLang.financeButton.rechargeSuccessText + ' ' + parseFloat(amount).toFixed(2) +
        ' ' + buffLang.financeButton.currency;
    try {
        await bot.telegram.sendMessage(userId, message);
    } catch (e) {
        console.log('Bot is blocked');
        console.log(e);
    }
};

const getChatId = async (ctx) => ctx.getChat().then(res => res.id);
const getUserLanguage = async (ctx) => {
    const userData = await botUtils.getUserData(await getChatId(ctx));
    let buffLang = null;
    languages.map(language => {
        const lgCode = language.settings.code.split(' ');
        if (lgCode[0].toLowerCase() === userData.language) {
            buffLang = language;
        }
    });
    return buffLang;
};

const getRightPaymentLink = async (ctx, language, bits, customBill) => {
    try {
        return await botUtils.getRechargeLink(bits, await getChatId(ctx));
    } catch (e) {
        if (customBill.balance) {
            await ctx.reply(language.financeButton.balanceMessage + ': ' + customBill.balance + ' '
                + language.financeButton.currency + '\n'
                + language.paymentBookMessage.failMessage + '!');
        }
        if (e.message === 'money problem') {
            await sendRechargeNotificationToOwner();
            await ctx.reply(language.paymentBookMessage.errorRechargeMessageNoMoneyOnWallet);
            return {extra: true};
        } else if (e.message.match(/(^https:\/\/.*)/)) {
            await ctx.reply(language.paymentBookMessage.alreadyExistUnPaidBill,
                Extra.HTML().markup(Markup.inlineKeyboard([Markup.urlButton(
                    language.financeButton.rechargeLink,
                    e.message
                )])));
            return {extra: true};
        } else {
            return null;
        }
    }
};

bot.start(async ctx => {
    const chatId = await getChatId(ctx);

    try {
        await botUtils.addUser(chatId);
    } catch (e) {
        console.log('Already in the database');
    }

    if (languages.length === 0) {
        return ctx.reply('No languages found!');
    } else {
        const list = languages.map(language => language.settings.code);
        return sendStartMessage(ctx, languages[0], list);
    }
});

// Books
bot.hears(languages.map(language => language.generalButtons.keyboardButtons.books), async ctx => {
    const language = await getUserLanguage(ctx);
    return sendBooksButtonMessage(ctx, language);
});
bot.hears(languages.map(language => language.booksButton.buttons.allBooks), async ctx => {
    const language = await getUserLanguage(ctx);
    const lastBook = await botUtils.getBooks(1, await getChatId(ctx));
    const numOfBooks = await botUtils.getBookPagesAmount();
    await sendSmallNavMessage(ctx, language.booksButton.buttons.allBooks,
        language.booksButton.buttons.allBooks, language.generalButtons.backButton.backButton);
    return sendBooksMessage(bot, ctx, language, lastBook, numOfBooks, constants.ALL_BOOKS + '_1');
});
bot.hears(languages.map(language => language.booksButton.buttons.myBooks), async ctx => {
    const language = await getUserLanguage(ctx);
    const lastBook = await botUtils.getBoughtBooks(await getChatId(ctx), 1);
    const numOfBooks = lastBook.pageAmount;
    await sendSmallNavMessage(ctx, language.booksButton.buttons.myBooks,
        language.booksButton.buttons.myBooks, language.generalButtons.backButton.backButton);
    return sendBooksMessage(bot, ctx, language, lastBook.books, numOfBooks, constants.MY_BOOKS + '_1');
});
bot.action(/(^buyBook\_[0-9]{1,}$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const trigger = ctx.update.callback_query.data;
    const parts = trigger.split('_');
    const bookId = parts[parts.length - 1];
    let bookInfo = await botUtils.getBookWithAuthorAndUser(bookId, await getChatId(ctx));
    if (bookInfo.length !== 0) {
        if (bookInfo[0].users.length !== 0) {
            return ctx.reply(language.paymentBookMessage.bookIsBought);
        }
        bookInfo = bookInfo[0];
    } else {
        return ctx.reply(language.failText);
    }
    let balance = await botUtils.getBalance(await getChatId(ctx));
    balance = parseFloat(balance.balance).toFixed(2);

    let paymentLink = null;
    if (bookInfo.cost > balance) {
        const difference = bookInfo.cost - balance;
        paymentLink = await getRightPaymentLink(ctx, language, Math.ceil(difference), {balance});
    }

    if (paymentLink !== null && paymentLink.errorCode) {
        return ctx.reply(language.failText);
    }

    return sendBuyBookMessage(ctx, language, bookInfo, balance, paymentLink);
});
bot.action(/(^buySuccess\_[0-9]{1,}$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const parts = ctx.update.callback_query.data.split('_');
    const bookId = parts[parts.length - 1];
    const isSuccess = await botUtils.buyBook(bookId, await getChatId(ctx));
    if (isSuccess) {
        return editBuyBookMessage(ctx, bot, language, language.paymentBookMessage.success);
    } else {
        return editBuyBookMessage(ctx, bot, language, language.paymentBookMessage.fail);
    }
});
bot.action(/(^showMyBooks$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const lastBook = await botUtils.getBoughtBooks(await getChatId(ctx), 1);
    const numOfBooks = lastBook.pageAmount;
    await sendSmallNavMessage(ctx, language.booksButton.buttons.myBooks,
        language.booksButton.buttons.myBooks, language.generalButtons.backButton.backButton);
    return sendBooksMessage(bot, ctx, language, lastBook.books, numOfBooks, constants.MY_BOOKS + '_1');
});

// Author books
bot.action(/(^author\_.*\_.*[0-9]$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const trigger = ctx.update.callback_query.data;
    const parts = trigger.split('_');
    const authorBooks = await botUtils.getAuthorsBooks(parts[parts.length - 1], 1, await getChatId(ctx));
    const numOfBooks = await botUtils.getAuthorBooksPagesAmount(parts[parts.length - 1]);
    return sendBooksMessage(bot, ctx, language, authorBooks.books, numOfBooks,
        constants.AUTHOR_BOOKS + '_' + authorBooks.id + '_1');
});

// View
bot.action(/(^view\_[0-9]{1,}$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const trigger = ctx.update.callback_query.data;
    const parts = trigger.split('_');
    const bookNum = parts[1];

    let bookFilePath = await botUtils.getFilesByBookId(bookNum);
    if (bookFilePath.length !== 0) {
        bookFilePath = bookFilePath[0].path;
        const name = bookFilePath.split('/')[1];
        bookFilePath = fs.readFileSync(`${bookFilePath}`);
        const fileObj = {
            source: bookFilePath,
            filename: name
        };
        return ctx.telegram.sendDocument(ctx.from.id, fileObj);
    } else {
        return ctx.reply(language.booksButton.buttons.viewError);
    }
});

// Authors
bot.hears(languages.map(language => language.generalButtons.keyboardButtons.authors), async ctx => {
    const language = await getUserLanguage(ctx);
    const authorsArray = await botUtils.getAuthors(1);
    const numOfAuthors = await botUtils.getAuthorsPagesAmount();
    await sendSmallNavMessage(ctx, language.authorsButton.authorsMessage,
        language.authorsButton.authorsMessage, language.generalButtons.backButton.backButton);
    return sendAuthorMessage(bot, ctx, language, authorsArray,
        Math.ceil(numOfAuthors * config.amountAuthorsPerPageTelegram),
        constants.AUTHOR_LIST + '_1'
    );
});

bot.action(/(^(?:previous|next)\_[A-z].*\_[0-9]{1,}$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const trigger = ctx.update.callback_query.data;
    const parts = trigger.split('_');
    const action = parts[0];
    const func = parts[1];
    let page = parts[parts.length - 1];

    if (action === 'next') {
        page++;
    } else if (action === 'previous') {
        page--;
    }

    let book;
    let numOfBooks;
    switch (func) {
        case constants.MY_BOOKS:
            book = await botUtils.getBoughtBooks(await getChatId(ctx), page);
            numOfBooks = book.pageAmount;
            return editBooksMessage(bot, ctx, language, book.books, numOfBooks, constants.MY_BOOKS + '_' + page);
        case constants.ALL_BOOKS:
            book = await botUtils.getBooks(page, await getChatId(ctx));
            numOfBooks = await botUtils.getBookPagesAmount();
            return editBooksMessage(bot, ctx, language, book, numOfBooks, constants.ALL_BOOKS + '_' + page);
        case constants.AUTHOR_BOOKS:
            const authorId = parts[parts.length - 2];
            const authorBooks = await botUtils.getAuthorsBooks(authorId, page);
            numOfBooks = await botUtils.getAuthorBooksPagesAmount(authorId);
            return editBooksMessage(bot, ctx, language, authorBooks.books, numOfBooks,
                constants.AUTHOR_BOOKS + '_' + authorBooks.id + '_' + page);
        case constants.AUTHOR_LIST:
            const authorsToShow = await botUtils.getAuthors(page);
            const numOfAuthors = await botUtils.getAuthorsPagesAmount();
            return editAuthorMessage(bot, ctx, language, authorsToShow,
                Math.ceil(numOfAuthors * config.amountAuthorsPerPageTelegram),
                constants.AUTHOR_LIST + '_' + page);
        default:
            return;
    }
});

// Finance
bot.hears(languages.map(language => language.generalButtons.keyboardButtons.finances), async ctx => {
    const language = await getUserLanguage(ctx);
    return sendFinanceMessage(ctx, language);
});
bot.hears(languages.map(language => language.financeButton.buttons.wallet), async ctx => {
    const language = await getUserLanguage(ctx);
    const balance = await botUtils.getBalance(await getChatId(ctx));
    const bitsCost = config.bitsCost;
    const paymentButtons = [];
    for (let x in bitsCost) {
        paymentButtons.push(bitsCost[x]);
    }
    return sendWalletMessage(ctx, language, balance, paymentButtons);
});
bot.action(/(^payment\_[0-9]{1,}$)/, async ctx => {
    const language = await getUserLanguage(ctx);
    const trigger = ctx.update.callback_query.data;
    const parts = trigger.split('_');
    const bits = parts[parts.length - 1];

    const paymentLink = await getRightPaymentLink(ctx, language, bits, {});
    if (paymentLink === null || paymentLink.errorCode) {
        return ctx.reply(language.failText);
    } else if (paymentLink.extra) {
        return;
    }
    return editWalletMessage(bot, ctx, language, bits, paymentLink.payUrl);
});

// About
bot.hears(languages.map(language => language.generalButtons.keyboardButtons.aboutJointBook), async ctx => {
    const language = await getUserLanguage(ctx);
    return sendAboutMessage(ctx, language);
});

// Settings
bot.hears(languages.map(language => language.generalButtons.keyboardButtons.settings), async ctx => {
    const language = await getUserLanguage(ctx);
    return sendSettingsMessage(ctx, language, languages.map(lg => lg.settings.code));
});

// Language
bot.hears(/([A-z]{2,3}\ .*)/, async ctx => {
    const searchingLanguage = ctx.message.text;
    let newLanguage = null;
    languages.forEach(language => {
        if (language.settings.code === searchingLanguage) {
            newLanguage = language;
            const lang = searchingLanguage.split(' ');
            botUtils.setUserLanguage(ctx.from.id, lang[0].toLowerCase());
        }
    });
    return sendBackMessage(ctx, newLanguage);
});

// Back button
bot.hears(languages.map(language => language.generalButtons.backButton.backButton), async ctx => {
    const language = await getUserLanguage(ctx);
    return sendBackMessage(ctx, language);
});


bot.catch(err => console.log('Ooops', err));
bot.startPolling();

module.exports = {
    sendRechargeMessage,
    sendRechargeNotificationToOwner
};