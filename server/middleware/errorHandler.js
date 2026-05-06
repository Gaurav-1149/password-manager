function errorHandler(error, req, res, next) {
  console.error(error);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: error.message || 'Server error' });
}

module.exports = errorHandler;
