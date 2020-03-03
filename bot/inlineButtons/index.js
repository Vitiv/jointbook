const constants = require('./../constants');
const config = require('../../config/debug');

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fs = require('fs');

const getFile = (path) => ({
    source: fs.readFileSync(path),
    type: 'photo',
});

const sendAndEditBooksMessageWithInlineKeyboard = async (bot, ctx, language, booksArrayToShow, numOfBooks, callBackButtonsActionData, method) => {
    const switchCase = callBackButtonsActionData.split('_');
    const buttons = [];
    if (booksArrayToShow.length !== 0) {
        const bookToShow = booksArrayToShow[0];
        const buyBtn = language.booksButton.buttons.buy + ' (' + bookToShow.cost + ' ' + language.financeButton.currency + ')';
        if (bookToShow.users) {
            if (bookToShow.users.length !== 0) {
                if (switchCase[0] === constants.MY_BOOKS) {
                    buttons.push([Markup.callbackButton(language.booksButton.buttons.view, 'view_' + bookToShow.id)]);
                } else {
                    buttons.push([Markup.callbackButton(language.booksButton.buttons.viewInAllBooks, 'view_' + bookToShow.id)]);
                }
            } else {
                buttons.push([Markup.callbackButton(buyBtn, 'buyBook_' + bookToShow.id)]);
            }
        } else {
            if (switchCase[0] === constants.MY_BOOKS) {
                buttons.push([Markup.callbackButton(language.booksButton.buttons.view, 'view_' + bookToShow.id)]);
            } else {
                buttons.push([Markup.callbackButton(buyBtn, 'buyBook_' + bookToShow.id)]);
            }
        }
        if (numOfBooks > 1) {
            if (switchCase[switchCase.length - 1] === '1') {
                buttons.push([Markup.callbackButton(language.generalButtons.navigationButtons.next, 'next_' + callBackButtonsActionData)]);
            } else if (switchCase[switchCase.length - 1] === numOfBooks.toString()) {
                buttons.push([Markup.callbackButton(language.generalButtons.navigationButtons.previous, 'previous_' + callBackButtonsActionData)]);
            } else {
                buttons.push(
                    [
                        Markup.callbackButton(language.generalButtons.navigationButtons.previous, 'previous_' + callBackButtonsActionData),
                        Markup.callbackButton(language.generalButtons.navigationButtons.next, 'next_' + callBackButtonsActionData)
                    ]
                );
            }
        }

        const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
        extra.reply_markup.remove_keyboard = true;
        if (method === constants.methods.send) {
            if (bookToShow.book_images.length !== 0) {
                extra.caption = bookToShow.description;
                const img = getFile(bookToShow.book_images[0].path);
                // const img = fs.readFileSync(bookToShow.book_images[0].path)
                return ctx.replyWithPhoto(img, extra);
            } else {
                return ctx.reply(bookToShow.description, extra);
            }
        } else if (method === constants.methods.edit) {
            const message = ctx.update.callback_query.message;
            if (bookToShow.book_images.length !== 0) {
                if (message.photo) {
                    return bot.telegram.editMessageMedia(message.chat.id, message.message_id, undefined, {
                        type: 'photo',
                        media: getFile(bookToShow.book_images[0].path),
                        caption: bookToShow.description
                    }, extra);
                } else {
                    await bot.telegram.deleteMessage(message.chat.id, message.message_id);
                    extra.caption = bookToShow.description;
                    return ctx.replyWithPhoto(getFile(bookToShow.book_images[0].path), extra);
                }
            } else {
                if (message.photo) {
                    await bot.telegram.deleteMessage(message.chat.id, message.message_id);
                    return bot.telegram.sendMessage(message.chat.id, bookToShow.description, extra);
                } else {
                    return bot.telegram.editMessageText(message.chat.id, message.message_id,
                        undefined, bookToShow.description, extra);
                }
            }
        }
    } else {
        if (method === constants.methods.send) {
            return ctx.reply(language.booksButton.booksErrorMessage);
        } else if (method === constants.methods.edit) {
            const message = ctx.update.callback_query.message;
            buttons.push(message.reply_markup.inline_keyboard[0]);
            if (numOfBooks > 1) {
                buttons.push([message.reply_markup.inline_keyboard[1][0]]);
            }
            const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
            if (message.photo) {
                return bot.telegram.editMessageCaption(message.chat.id,
                    message.message_id, undefined,
                    message.caption, extra);
            } else {
                return bot.telegram.editMessageText(message.chat.id,
                    message.message_id, undefined,
                    message.text, extra);
            }
        }
    }
};

const createAuthorInlineButton = (author) => {
    const nameArray = author.name.split(' ');
    let buffName = '';
    nameArray.forEach((part, index) => {
        buffName = buffName + part;
        if (index !== nameArray.length - 1) {
            buffName = buffName + '_';
        }
    });
    return Markup.callbackButton(author.name, 'author_' + buffName + '_' + author.id);
};

const sendAndEditAuthorsListMessageWithInlineKeyboard = async (bot, ctx, language, authorsToShow, numOfAuthors, callBackButtonsActionData, method) => {
    const buttons = [];
    if (authorsToShow.length !== 0) {
        const caption = language.authorsButton.authorsListMessage + ':';

        authorsToShow.forEach(author => {
            buttons.push([createAuthorInlineButton(author)]);
        });

        if (numOfAuthors > config.amountAuthorsPerPageTelegram) {
            const split = callBackButtonsActionData.split('_');
            const pageNumber = Math.ceil(split[split.length - 1] * config.amountAuthorsPerPageTelegram);
            if (split[split.length - 1] === '1') {
                buttons.push([Markup.callbackButton(language.generalButtons.navigationButtons.next, 'next_' + callBackButtonsActionData)]);
            } else if (pageNumber >= numOfAuthors) {
                buttons.push([Markup.callbackButton(language.generalButtons.navigationButtons.previous, 'previous_' + callBackButtonsActionData)]);
            } else {
                buttons.push(
                    [
                        Markup.callbackButton(language.generalButtons.navigationButtons.previous, 'previous_' + callBackButtonsActionData),
                        Markup.callbackButton(language.generalButtons.navigationButtons.next, 'next_' + callBackButtonsActionData)
                    ]
                );
            }
        }

        const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
        if (method === constants.methods.send) {
            return ctx.reply(caption, extra);
        } else if (method === constants.methods.edit) {
            const message = ctx.update.callback_query.message;
            return bot.telegram.editMessageText(message.chat.id, message.message_id, undefined, caption, extra);
        }
    } else {
        if (method === constants.methods.send) {
            return ctx.reply(language.authorsButton.authorsErrorMessage);
        } else if (method === constants.methods.edit) {
            const message = ctx.update.callback_query.message;
            buttons.push(message.reply_markup.inline_keyboard[0]);
            if (numOfAuthors > 1) {
                buttons.push([message.reply_markup.inline_keyboard[1][0]]);
            }
            const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
            return bot.telegram.editMessageText(message.chat.id,
                message.message_id,
                undefined,
                message.text,
                extra);
        }
    }
};

const sendWalletMessageWithInlineButtons = async (ctx, language, balance, paymentButtons) => {
    const buttons = [];
    paymentButtons.forEach(payment => {
        buttons.push([
            Markup.callbackButton(
                'Recharge ' + payment + ' ' + language.financeButton.currency,
                'payment_' + payment
            )
        ]);
    });
    const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
    const caption = language.financeButton.balanceMessage + ': '
        + parseFloat(balance.balance).toFixed(2) + ' '
        + language.financeButton.currency + '\n\n' + '<code>' + balance.addressString + '</code>';
    return ctx.reply(caption, extra, {parse_mode: 'HTML'});
};

const editWalletMessageWithInlineButtons = async (bot, ctx, language, bits, paymentLink) => {
    const message = ctx.update.callback_query.message;
    return bot.telegram.editMessageReplyMarkup(message.chat.id, message.message_id,
        undefined, Markup.inlineKeyboard([
            Markup.urlButton(
                language.financeButton.rechargeLink + ' ' + bits + ' ' + language.financeButton.currency,
                paymentLink
            )
        ]));
};

const sendBuyBookMessageWithInlineButtons = async (ctx, language, bookInfo, balance, paymentLink) => {
    const buttons = [];
    let messageText = language.paymentBookMessage.book + ': ' + bookInfo.name + '\n';
    messageText += language.paymentBookMessage.author + ': ' + bookInfo.author.name + '\n';
    messageText += language.paymentBookMessage.cost + ': ' + bookInfo.cost + '\n';

    if (paymentLink === null) {
        buttons.push([Markup.callbackButton(
            language.paymentBookMessage.confirm,
            'buySuccess_' + bookInfo.id
        )]);
    } else {
        messageText += '\n' + language.financeButton.balanceMessage + ': ' + balance + ' ' + language.financeButton.currency + '\n';
        messageText += language.paymentBookMessage.failMessage + '!';
        buttons.push([Markup.urlButton(
            language.financeButton.buttons.rechargeBalance + ' '
            + Math.ceil(bookInfo.cost - balance) + ' ' + language.financeButton.currency,
            paymentLink.payUrl
        )]);
    }
    const extra = Extra.HTML().markup(Markup.inlineKeyboard(buttons));
    return ctx.reply(messageText, extra);
};

const editBuyBookMessageWithInlineButtons = async (ctx, bot, language, buttonMessage) => {
    const message = ctx.update.callback_query.message;

    await bot.telegram.editMessageReplyMarkup(message.chat.id, message.message_id, undefined);
    return ctx.reply(language.paymentBookMessage.thanksMessage, Extra.HTML().markup(Markup.inlineKeyboard([
        Markup.callbackButton(language.paymentBookMessage.goToBoughtBooks, 'showMyBooks')
    ])));
};

module.exports = {
    sendAndEditBooksMessageWithInlineKeyboard,
    sendAndEditAuthorsListMessageWithInlineKeyboard,
    sendWalletMessageWithInlineButtons,
    editWalletMessageWithInlineButtons,
    sendBuyBookMessageWithInlineButtons,
    editBuyBookMessageWithInlineButtons
};