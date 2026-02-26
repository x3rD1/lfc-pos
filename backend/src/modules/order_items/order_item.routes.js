const { Router } = require("express");
const router = Router();
const order_item_controller = require("./order_item.controller");

router.post("/", order_item_controller.create_order_item);
router.patch("/:itemId", order_item_controller.update_order_item);
router.delete("/:itemId", order_item_controller.delete_order_item);

module.exports = router;
