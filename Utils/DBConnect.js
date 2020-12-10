const mongoose = require('mongoose');

module.exports = () => {
   const getDBString = () => {
      return process.env.DB_LOCAL.trim();
      //   if (process.argv[2] === 'dblocal') {
      //      console.log('Connecting to Local DB ...');
      //      return DB_LOCAL.trim();
      //   } else {
      //      console.log('Connecting to Cluster DB ...');
      //      return DB_URL.replace('<DB_USER>', DB_USER)
      //         .replace('<DB_PASSWORD>', DB_PASSWORD)
      //         .trim();
      //   }
   };

   const DB_URL = process.env.DB;
   const DB_PASSWORD = process.env.DB_PASSWORD;
   const DB_USER = process.env.DB_USER;
   const DB_LOCAL = process.env.DB_LOCAL;
   const DB = getDBString();
   // console.log('DB', DB);
   // console.log(DB_URL);
   //connecting to db
   mongoose
      .connect(DB, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then((res) => console.log('Database COnnected Successfully !'))
      .catch((err) => {
         console.clear();
         console.log('error ', err);
      });
};
