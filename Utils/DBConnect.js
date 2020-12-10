const mongoose = require('mongoose');

module.exports = () => {
   const DB_URL = process.env.DB;

   mongoose
      .connect(DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then((res) => console.log('Database COnnected Successfully !'))
      .catch((err) => {
         console.clear();
         console.log('error ', err);
      });
};
