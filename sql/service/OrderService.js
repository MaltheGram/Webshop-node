import model, {sequelize} from "../models/models.js"


class OrderService {

    constructor() {
    }


    static getAll = async () => {
        try {
            const orders = await model.Order.findAll({
                include: [
                    {
                        model: model.OrderLineItem,
                        as: 'lineItems'
                    },
                    {
                        model: model.OrderStatus,
                        as: 'statusDetails',
                        attributes: ["name"]
                    }
                ]
            })

            return orders

        } catch (error) {
            console.error("Error fetching orders:", error)
            throw error
        }
    }

    static getById = async (id) => {
        return await model.Order.findByPk(id, {
            include: [
                {
                    model: model.OrderLineItem,
                    as: 'lineItems'
                },
                {
                    model: model.OrderStatus,
                    as: 'statusDetails',
                    attributes: ["name"]
                }
            ]
        })
    }

    static create = async (params, userId) => {

        const transaction = await sequelize.transaction()

        try {

            const userExists = await model.User.findByPk(userId)

            if (!userExists) {
                throw new Error("No user with that ID")
            }

            const orderStatus = await model.OrderStatus.findOne({
                where: {name: 'Order received'}
            })

            const order = await model.Order.create({
                userId: userId,
                orderStatusId: orderStatus.id,
                paymentId: null
            }, {transaction})

            for (const product of params?.products) {
                await model.OrderLineItem.create({
                    orderId: order.id,
                    productId: product.productId,
                    quantity: product.quantity || params.quantity
                }, {transaction})

                const inventory = await model.Inventory.findOne({
                        productId: product.id
                })

                await model.Inventory.update({
                    where: {
                        productId: inventory.id
                    },
                    stock: inventory.stock -= product.quantity || params.quantity
                })
            }
            await transaction.commit()

        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    // TODO: Payment update, order line items update, order status update
    static update = async (orderId, updateData) => {

        const transaction = await sequelize.transaction()

        try {
            const order = await model.Order.findByPk(orderId)
            if (!order) {
                throw new Error('Order not found')
            }

            if (order.paymentId) {
                throw new Error("Order is already paid.")
            }

            const relatedPayment = await model.Payment.create({
                userId: order.userId,
                total_price: updateData.totalPrice
            }, {transaction})

            const relatedPaymentDetails = await model.PaymentDetail.create({
                paymentId: relatedPayment.id,
                transaction_number: Math.floor(Math.random() * 99),  // Placeholder logic
                card_number: Math.floor(Math.random() * 149)         // Placeholder logic
            }, {transaction})

            await model.Order.update({
                paymentId: relatedPayment.id,
            }, {
                where: {
                    id: order.id
                },
                transaction
            })

            await transaction.commit()

        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }


    static delete = async (id) => {
        //const transaction = await model.sequelize.transaction()
        try {
            const order = await model.Order.findByPk(id)
            if (!order) {
                throw new Error('Order not found')
            }
            await order.destroy()
            //await transaction.commit()
        } catch (error) {
            //await transaction.rollback()
            throw error
        }
    }


}


export default OrderService
