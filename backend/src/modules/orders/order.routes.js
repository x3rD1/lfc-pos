const { Router } = require("express");
const router = Router();
const orderController = require("./order.controller");

router.get("/", orderController.getAllOrFilteredOrders);
router.get("/:orderId", orderController.getOrder);
router.post("/", orderController.createOrder);
router.patch("/:orderId", orderController.updateOrderStatus);
router.delete("/:orderId", orderController.deleteOrder);
module.exports = router;
