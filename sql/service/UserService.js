import bcrypt from 'bcrypt';
import model from "../models/models.js";

class UserService {


    constructor() {
    }

    static getAll = async (limit) => {
        return await model.User.findAll({
          limit: Number(limit)
        })
    }
    static getById = async (id) => {
        return await model.User.findByPk(id)
    }
    static create = async (params) => {
        console.log('Received Params:', params);
    
        const existingUser = await model.User.findOne({
          where: {
            email: params.email,
          },
        });
    
        if (existingUser) {
          throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(params.password, 10);
        const transaction = await model.sequelize.transaction();
        try {
          const user = await model.User.create({
            ...params,
            password: hashedPassword,
          }, { transaction });
    
          const userId = user.id;
    
          const addressParams = {
            ...params.address,
            userId: userId,
          };
    
          await model.Address.create(addressParams, { transaction });
    
          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      }

      static signin = async (email, password) => {
        const user = await model.User.findOne({
          where: {
            email: email,
          },
        });
    
        if (!user) {
          throw new Error('User or password incorrect');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          throw new Error('User or password incorrect');
        }
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone_number: user.phone_number,
        };
      };

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


