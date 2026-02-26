const order_item_service = require("./order_item.service");

exports.create_order_item = async (req, res, next) => {
  try {
    const data = {
      itemId: req.body.itemId,
      orderId: req.body.orderId,
      ownerId: req.user.id,
    };
    const order_item = await order_item_service.create_order_item(data);

    res.status(201).json(order_item);
  } catch (err) {
    next(err);
  }
};

exports.update_order_item = async (req, res, next) => {
  try {
    const data = {
      itemId: req.params.itemId,
      orderId: req.body.orderId,
    };

    const updated_order_item = await order_item_service.update_order_item(data);

    res.json(updated_order_item);
  } catch (err) {
    next(err);
  }
};

exports.delete_order_item = async (req, res, next) => {
  try {
    const data = {
      itemId: req.params.itemId,
      orderId: req.body.orderId,
    };

    await order_item_service.delete_order_item(data);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
