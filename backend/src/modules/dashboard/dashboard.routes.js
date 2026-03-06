const { Router } = require("express");
const router = Router();
const dashboardController = require("./dashboard.controller");

router.get("/summary", dashboardController.summary);

module.exports = router;
