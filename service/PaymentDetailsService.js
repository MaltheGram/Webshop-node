import model from "./models.js";

class PaymentDetailsService {
    static getAllPaymentDetails = async () => {
        return await model.PaymentDetail.findAll();
    }

    static getPaymentDetailById = async (id) => {
        return await model.PaymentDetail.findByPk(id);
    }

    static getPaymentDetailsForPayment = async (paymentId) => {
        return await model.PaymentDetail.findAll({ where: { paymentId: paymentId } });
    }

    static createPaymentDetail = async (params) => {
        return await model.PaymentDetail.create(params);
    }

    static updatePaymentDetail = async (id, updates) => {
        const paymentDetail = await model.PaymentDetail.findByPk(id);
        if (!paymentDetail) return null;
        return await paymentDetail.update(updates);
    }

    static deletePaymentDetail = async (id) => {
        const paymentDetail = await model.PaymentDetail.findByPk(id);
        if (!paymentDetail) return null;
        return await paymentDetail.destroy();
    }
}

export default PaymentDetailsService;
