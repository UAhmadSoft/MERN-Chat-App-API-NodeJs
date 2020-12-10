const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
   messages: [
      {
         text: String,
         user: {
            name: String,
            avatar: String,
         },
      },
   ],
   _id: String,
});

const Model = mongoose.model('Message', messageSchema);

module.exports = Model;
