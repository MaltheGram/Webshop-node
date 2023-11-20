import sequelize from "./database";
import Category from "./category";
import OrderStatus from "./orderStatus";
import Product from "./product";
import Inventory from "./inventory";
import User from "./user";
import Address from "./address";
import Payment from "./payment";
import Order from "./order";
import OrderLineItem from "./orderLineItem";
import PaymentDetail from "./paymentDetail";

sequelize.sync();

export {
  Category,
  OrderStatus,
  Product,
  Inventory,
  User,
  Address,
  Payment,
  Order,
  OrderLineItem,
  PaymentDetail,
  sequelize,
};
