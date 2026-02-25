const itemService = require("./item.service");

exports.getAllItems = async (req, res, next) => {
  try {
    const id = req.user.id;
    const items = await itemService.getAllItems(id);

    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const data = {
      ownerId: req.user.id,
      ...req.body,
    };
    const item = await itemService.createItem(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const data = {
      itemId: req.params.itemId,
      ownerId: req.user.id,
      ...req.body,
    };

    const updatedItem = await itemService.updateItem(data);

    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const data = { itemId: req.params.itemId, ownerId: req.user.id };

    await itemService.deleteItem(data);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
