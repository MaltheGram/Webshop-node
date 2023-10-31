import model from "../models.js"

class UserService {


    constructor() {
    }

    static getAll = async () => {
        return await model.User.findAll()
    }
    static getById = async (id) => {
        return await model.User.findByPk(id)
    }
    static create = async (params) => {
        // Start a transaction
        const transaction = await model.sequelize.transaction();

        try {
            const user = await model.User.create(params, {transaction})
            const userId = user.id;

            const addressParams = {
                ...params.Address,
                userId: userId
            };

            await model.Address.create(addressParams, {transaction})

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error
        }
    }
    static update = async (userId, updateData) => {
        try {
            const user = await model.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            return user.update(updateData);

        } catch (error) {
            throw error;
        }
    }

    static delete = async (id) => {
        try {
            return await model.User.destroy({where: {id: id}})

        } catch (err) {
            throw err
        }

    }
}


export default UserService


