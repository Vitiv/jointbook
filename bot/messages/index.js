const {sleep, htmlValidator} = require('./../stuff/index');
const constants = require('./../constants');

const {
    sendStartMessageWithKeyboardButtons,
    sendGeneralMessageWithKeyboardButtons,
    sendSmallNavKeyboardButtons,
    sendBooksMessageWithKeyboardButtons,
    sendFinanceMessageWithKeyboardButtons,
    sendSettingsMessageWithKeyboardButtons
} = require('./../keyboardButtons/index');

const {
    sendAndEditBooksMessageWithInlineKeyboard,
    sendAndEditAuthorsListMessageWithInlineKeyboard,
    sendWalletMessageWithInlineButtons,
    editWalletMessageWithInlineButtons,
    sendBuyBookMessageWithInlineButtons,
    editBuyBookMessageWithInlineButtons
} = require('./../inlineButtons/index');

const sendStartMessage = async (ctx, language, allLanguages) =>
    sendStartMessageWithKeyboardButtons(ctx,
        language.generalButtons.startMessage,
        allLanguages);

const sendBackMessage = async (ctx, language) =>
    sendGeneralMessageWithKeyboardButtons(ctx,
        language.generalButtons.backButton.backMessage,
        language.generalButtons.keyboardButtons);

const sendBooksButtonMessage = async (ctx, language) =>
    sendBooksMessageWithKeyboardButtons(ctx,
        language.booksButton.booksMessage,
        language.booksButton.buttons,
        language.generalButtons.backButton.backButton);

const sendSmallNavMessage = async (ctx, message, generalButton, backButton) =>
    sendSmallNavKeyboardButtons(ctx, message, generalButton, backButton);

const sendFinanceMessage = async (ctx, language) =>
    sendFinanceMessageWithKeyboardButtons(ctx,
        language.financeButton.financeMessage,
        language.financeButton.buttons,
        language.generalButtons.backButton.backButton);

const sendSettingsMessage = async (ctx, language, allLanguages) =>
    sendSettingsMessageWithKeyboardButtons(ctx,
        language.settings.settingsMessage,
        allLanguages,
        language.generalButtons.backButton.backButton);

const sendBooksMessage = async (bot, ctx, language, bookToShow, numOfBooks, callBackButtonsActionData) =>
    sendAndEditBooksMessageWithInlineKeyboard(bot, ctx, language, bookToShow, numOfBooks, callBackButtonsActionData, constants.methods.send);
const sendAuthorMessage = async (bot, ctx, language, authorsToShow, numOfAuthors, callBackButtonsActionData) =>
    sendAndEditAuthorsListMessageWithInlineKeyboard(bot, ctx, language, authorsToShow, numOfAuthors, callBackButtonsActionData, constants.methods.send);
const sendWalletMessage = async (ctx, language, balance, paymentButtons) =>
    sendWalletMessageWithInlineButtons(ctx, language, balance, paymentButtons);
const sendAboutMessage = async (ctx, language) =>
    ctx.replyWithHTML(language.aboutJointBook);
const sendBuyBookMessage = async (ctx, language, bookInfo, balance, paymentLink) =>
    sendBuyBookMessageWithInlineButtons(ctx, language, bookInfo, balance, paymentLink);

const editBooksMessage = async (bot, ctx, language, bookToShow, numOfBooks, callBackButtonsActionData) =>
    sendAndEditBooksMessageWithInlineKeyboard(bot, ctx, language, bookToShow, numOfBooks, callBackButtonsActionData, constants.methods.edit);
const editAuthorMessage = async (bot, ctx, language, authorsToShow, numOfAuthors, callBackButtonsActionData) =>
    sendAndEditAuthorsListMessageWithInlineKeyboard(bot, ctx, language, authorsToShow, numOfAuthors, callBackButtonsActionData, constants.methods.edit);
const editWalletMessage = async (bot, ctx, language, bits, paymentLink) =>
    editWalletMessageWithInlineButtons(bot, ctx, language, bits, paymentLink);
const editBuyBookMessage = async (ctx, bot, language, buttonMessage) =>
    editBuyBookMessageWithInlineButtons(ctx, bot, language, buttonMessage);

module.exports = {
    sendBooksMessage,
    sendSmallNavMessage,
    editBooksMessage,
    sendStartMessage,
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
};