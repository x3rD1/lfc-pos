const orderService = require("./order.service");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders(req.user.id);

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const data = { orderId: req.params.orderId, ownerId: req.user.id };
    const order = await orderService.getOrder(data);

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    await orderService.createOrder(req.user.id);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const data = { orderId: req.params.orderId, ownerId: req.body.ownerId };
    await orderService.deleteOrder(data);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
