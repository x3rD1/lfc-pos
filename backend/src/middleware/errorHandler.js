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

    case "ITEM_NOT_FOUND":
      return res.status(404).json({
        message: "Item not found",
      });

    case "PRICE_CANNOT_BE_NEGATIVE":
      return res.status(400).json({ message: "Price cannot be negative" });

    case "ORDER_DO_NOT_EXISTS":
      return res.status(404).json({ message: "Create an order" });

    case "USER_DO_NOT_EXISTS":
      return res.status(404).json({ message: "User not found" });

    case "FORBIDDEN":
      return res.status(403).json({ message: "Forbidden action" });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
