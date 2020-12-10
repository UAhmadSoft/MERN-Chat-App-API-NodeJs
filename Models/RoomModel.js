const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'A Room must have a Name'],
      unique: [true, 'Room Name must be unique'],
      trim: true,
   },
   locked: {
      type: Boolean,
      default: false,
   },
   key: {
      trim: true,
      type: String,
      default: '',
   },
   users: {
      required: true,
      default: [],
      type: [
         {
            name: { type: String, trim: true },
            avatar: {
               type: String,
               required: true,
               default: '',
            },
         },
      ],
   },
   messages: {
      required: true,
      default: [],
      type: [
         {
            text: { type: String, trim: true },
            user: {
               name: String,
               avatar: {
                  type: String,
                  required: true,
                  default: '',
               },
            },
         },
      ],
   },
});

roomSchema.pre(/save|create/g, function (next) {
   if (!this.users) {
      next();
   }
   this.users = this.users.map((user) => {
      return (user.avatar = `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=40`);
   });

   next();
});

const Model = mongoose.model('Room', roomSchema);

module.exports = Model;
