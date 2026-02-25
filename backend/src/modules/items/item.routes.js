const { Router } = require("express");
const router = Router();
const itemController = require("./item.controller");

router.get("/", itemController.getAllItems);
router.post("/", itemController.createItem);
router.patch("/:itemId", itemController.updateItem);
router.delete("/:itemId", itemController.deleteItem);

module.exports = router;
