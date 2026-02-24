require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

require("../lib/passport");

const app = express();

app.use(cors({ origin: `${process.env.FRONTEND_URL}`, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set("trust proxy", 1);
const sessionMiddleware = session({
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  proxy: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

const { requireAuth } = require("./modules/auth/auth.middleware");
const authRoutes = require("./modules/auth/auth.routes");

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
