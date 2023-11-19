import { UserModel } from "../models/models.js";

class UserService {
  static async addUserOrder(userId, order) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orders: order } },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }
}

export default UserService;
