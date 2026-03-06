const dashboardService = require("./dashboard.service");

exports.summary = async (req, res, next) => {
  try {
    const metrics = await dashboardService.summary(req.user.id);

    res.json(metrics);
  } catch (err) {
    next(err);
  }
};
