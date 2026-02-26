const { Router } = require("express");
const router = Router();
const orderController = require("./order.controller");

router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrder);
router.post("/", orderController.createOrder);
router.delete("/:orderId", orderController.deleteOrder);
module.exports = router;
