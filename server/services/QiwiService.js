const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const fetch = require('node-fetch');

const config = require('config');
const qiwiConfig = config.get('qiwi');
const secretKey = qiwiConfig.secretKey;
const publicKey = qiwiConfig.publicKey;

const qiwiApi = new QiwiBillPaymentsAPI(secretKey);

const createPaymentLinkForCustomer = async (generatedBillId, amount, comment, id, bits) => {
    const expirationDate = new Date(new Date().getTime() + config.get('billDurationMillis') - config.get('qiwiErrorDurationMillisSmallerThenBillDuration'));
    const res = await fetch('https://api.qiwi.com/partner/bill/v1/bills/' + generatedBillId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + secretKey
        },
        body: JSON.stringify({
            'amount': {
                'currency': 'RUB',
                'value': amount.toFixed(2)
            },
            'comment': comment,
            'expirationDateTime': expirationDate.toISOString(),
            'customFields': {
                'id': id,
                'bits': bits
            }
        })
    });
    return res.json();
};

const boolCheckPaymentValid = async (validSignatureFromNotificationServer, bodyData) => {
    let billData = {
        bill: {
            siteId: bodyData.bill.siteId,
            billId: bodyData.bill.billId,
            amount: {
                value: Number(bodyData.bill.amount.value),
                currency: bodyData.bill.amount.currency
            },
            status: bodyData.bill.status,
            version: bodyData.bill.version
        }
    };

    return qiwiApi.checkNotificationSignature(validSignatureFromNotificationServer, billData, secretKey);
};

const getPaymentDataFromNotification = async (dataFromPostRequest) => {
    const bill = dataFromPostRequest.bill;

    if (bill.status.value === 'PAID') {
        const value = bill.customFields.bits;
        const id = bill.customFields.id;
        return {value, id};
    } else {
        return bill.status.value;
    }
};

const checkPayment = async (billId) => {
    const res = await qiwiApi.getBillInfo(billId);
    return res.json();
};

const cancelUnpaidInvoice = async (billId) => {
    const res = await qiwiApi.cancelBill(billId);
    return res.json();
};

module.exports = {
    createPaymentLinkForCustomer,
    boolCheckPaymentValid,
    getPaymentDataFromNotification,
    checkPayment,
    cancelUnpaidInvoice
};