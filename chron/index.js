const sendMoneyFromBooksToMain = require('./sendMoneyFromBooksToMain');
const deleteBill = require("./deleteBills");

setInterval(sendMoneyFromBooksToMain, 1000 * 60 * 60 * 24);
setInterval(deleteBill, 1000 * 60 * 60 * 24);
// setInterval(sendMoneyFromBooksToMain, 10000);
// setInterval(deleteBill, 10000);
