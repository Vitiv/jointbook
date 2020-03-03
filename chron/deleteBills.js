const billService = require("../server/services/BillService");
const config = require("config");

module.exports = async () => {
    return billService.deleteBillsCreatedLater(new Date(new Date().getTime() - config.get("billDurationMillis")));
};