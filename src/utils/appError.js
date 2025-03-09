class AppError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status || 500; // Default status is 500 (Internal Server Error)
  }
}

module.exports = AppError;
