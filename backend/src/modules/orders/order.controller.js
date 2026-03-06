const orderService = require("./order.service");

exports.getAllOrFilteredOrders = async (req, res, next) => {
  try {
    const { status, start, end } = req.query;

    const orders = await orderService.getAllOrFilteredOrders({
      ownerId: req.user.id,
      status,
      start,
      end,
    });

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
    const order = await orderService.createOrder(req.user.id);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const data = {
      orderId: req.params.orderId,
      ownerId: req.user.id,
      status: req.body.status,
    };
    await orderService.updateOrderStatus(data);

    res.status(204).send();
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
