module.exports = (err, req, res, next) => {
   // set locals, only providing error in development
   err.status = err.status || 'error';
   err.statusCode = err.statusCode || 500;

   if (err.code === 11000) {
      return res.status(403).json({
         status: err.status,
         message: 'Duplicate Room Name',
      });
   }
   // render the error page
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
};
