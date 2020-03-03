const Markup = require('telegraf/markup');

const sendStartMessageWithKeyboardButtons = async (ctx, message, allLanguages) =>
    ctx.reply(message,
        Markup.keyboard(allLanguages.map(language => language))
            .resize()
            .extra()
    );

const sendGeneralMessageWithKeyboardButtons = async (ctx, message, buttons) =>
    ctx.reply(message,
        Markup.keyboard([
            [buttons.books, buttons.authors],
            [buttons.finances],
            [buttons.aboutJointBook, buttons.settings]
        ])
            .resize()
            .extra()
    );

const sendBooksMessageWithKeyboardButtons = async (ctx, message, buttons, backButton) =>
    ctx.reply(message,
        Markup.keyboard(
            [
                [buttons.allBooks],
                [buttons.myBooks],
                [backButton]
            ]
        )
            .resize()
            .extra()
    );

const sendSmallNavKeyboardButtons = async (ctx, message, generalButton, backButton) => {
    ctx.reply(message,
        Markup.keyboard(
            [
                [generalButton, backButton]
            ]
        )
            .resize()
            .extra()
    );
};

const sendFinanceMessageWithKeyboardButtons = async (ctx, message, buttons, backButton) =>
    ctx.reply(message,
        Markup.keyboard(
            [
                [buttons.wallet],
                [backButton]
            ]
        )
            .resize()
            .extra()
    );

const sendSettingsMessageWithKeyboardButtons = async (ctx, message, allLanguages, backButton) => {
    const buttons = [];
    allLanguages.forEach(language => buttons.push(language));
    buttons.push(backButton);
    return ctx.reply(message,
        Markup.keyboard(buttons)
            .resize()
            .extra()
    );
};

module.exports = {
    sendStartMessageWithKeyboardButtons,
    sendGeneralMessageWithKeyboardButtons,
    sendSmallNavKeyboardButtons,
    sendBooksMessageWithKeyboardButtons,
    sendFinanceMessageWithKeyboardButtons,
    sendSettingsMessageWithKeyboardButtons
};