function errorHandler(err, req, res, next) {
  switch (err && err.message) {
    case "EMAIL_ALREADY_EXISTS":
      return res
        .status(409)
        .json({ field: "email", message: "Email already in use" });

    case "COMPANY_ALREADY_EXISTS":
      return res
        .status(409)
        .json({ field: "company", message: "Company name already in use" });

    case "INVALID_CREDENTIALS":
      return res.status(401).json({
        message: "Invalid email or password",
      });

    case "FORBIDDEN":
      return res.status(403).json({ message: "Forbidden action" });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
