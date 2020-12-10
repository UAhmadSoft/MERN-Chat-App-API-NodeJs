class AppError extends Error {
   constructor(message, errCode) {
      super(message);

      this.statusCode = errCode;
      this.status = `${errCode}`.startsWith('4') ? 'fail' : 'error';

      this.status = this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
   }
}

module.exports = AppError;
