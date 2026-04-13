const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

const errorResponse = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ error: message });
};

module.exports = {
  successResponse,
  errorResponse
};