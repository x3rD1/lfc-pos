const authService = require("./auth.service");
const passport = require("../../../lib/passport");

exports.getMe = async (req, res, next) => {
  console.log(req.user);
  res.json(req.user);
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const error = new Error("INVALID_CREDENTIALS");
      error.status = 401;
      return next(error);
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Logged in successfully" });
    });
  })(req, res, next);
};

exports.signup = async (req, res, next) => {
  try {
    await authService.signup(req.body);

    res.json({ message: "Account created!" });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
};
