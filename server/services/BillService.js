const Op = require("sequelize").Op;
const models = require("../../db");
const billModel = models.bill;

const createBill = async (billId, amount, userId, link) => {
    return billModel.create({billId, amount, userId, link})
};
const deleteBillsCreatedLater = async (date) => {
    return billModel.destroy({where: {
        createdAt: {
            [Op.lt]: date
        }
    }});
};
const getBillsCreatedLater = async (date) => {
    return billModel.findAll({where: {
        createdAt: {
            [Op.gt]: date
        }
    }});
};
const getBillsByUserIdAndCreatedLater = async (date, userId) => {
    return billModel.findOne({where: {
        createdAt: {
            [Op.gt]: date
        },
        userId
    }})
};
const deleteByBillId = async (billId) => {
    return billModel.destroy({where: {billId}})
};

module.exports = {createBill, deleteBillsCreatedLater, getBillsCreatedLater, getBillsByUserIdAndCreatedLater, deleteByBillId};