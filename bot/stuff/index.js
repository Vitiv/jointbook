const validator = require('html-validator');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const htmlValidator = async (htmlCode) => {
    try {
        const result = await validator({
            data: htmlCode,
            isFragment: true
        });
        return JSON.parse(result).messages.length <= 0;
    } catch (error) {
        console.log('Catch block HTML validator ', error);
        return false;
    }
};

module.exports = {sleep, htmlValidator};