// Retrieve all users with a specific order item
db.users.aggregate([
  { $match: { "orders.orderItems._id": ObjectId("6570d44416ec02cdeb6b5932") } },
  { $unwind: "$orders" },
  { $unwind: "$orders.orderItems" },
  { $match: { "orders.orderItems._id": ObjectId("6570d44416ec02cdeb6b5932") } },
  { $project: { userId: "$_id", orderItem: "$orders.orderItems" } },
]);

// Retrieve all orders with a specific order item
db.orders.find({ "orderItems._id": ObjectId("6570d44416ec02cdeb6b5932") });

// Retrieve user with a specific order id
db.users.find({ "orders._id": ObjectId("6570d44416ec02cdeb6b596a") });

// Count the number of orders for a specific user
db.users.aggregate([
  { $match: { _id: ObjectId("6570d44416ec02cdeb6b596a") } },
  { $project: { numberOfOrders: { $size: "$orders" } } },
]);

// Retrieve all orders for a specific user
db.users.aggregate([
  { $match: { _id: ObjectId("6570d44516ec02cdeb6b599c") } },
  { $unwind: "$orders" },
  { $project: { userId: "$_id", order: "$orders" } },
]);
