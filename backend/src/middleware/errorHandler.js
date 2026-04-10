// Catches any error thrown via next(err) and returns a clean JSON response
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error("[Error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "An unexpected error occurred.",
  });
}

module.exports = errorHandler;
