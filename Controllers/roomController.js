const mongoose = require('mongoose');
const Room = require('../Models/RoomModel');
const CatchAsync = require('../Utils/CatchAsync');

exports.getAllRooms = CatchAsync(async (req, res, next) => {
   const rooms = await Room.find({});

   res.status(200).json({
      success: 'success',
      results: rooms.length,
      rooms,
   });
});

exports.getRoom = CatchAsync(async (req, res, next) => {
   let { roomName, key, userName } = req.params;

   if (!roomName) {
      return res.status(403).json({
         success: 'fail',
         message: 'Plz provide roomName to get room',
      });
   }

   roomName = roomName.replace(/%/g, '/ /');
   userName = userName.replace(/%/g, '/ /');

   let room;
   if (!key) {
      room = await Room.findOne({ name: roomName });
   } else {
      key = key.replace(/%/g, / /);
      room = await Room.findOne({
         name: roomName.toLowerCase().trim(),
         key: key.toLowerCase().trim(),
      });
   }

   if (!room || room.length === 0) {
      return res.status(404).json({
         success: 'fail',
         message: 'No Room with this Combination of Id and key',
      });
   }

   if (room.users) {
      room.users = room.users.push({
         name: userName.trim(),
      });
   } else {
      room.users = [
         {
            name: userName.trim(),
         },
      ];
   }

   console.log('room.messages', room.messages);

   const updatedRoom = await room.save({ validateBeforeSave: false });

   res.json({
      success: 'success',
      room: updatedRoom,
   });

   console.log('updatedRoom', updatedRoom.messages);
   // * Send Event to Client that New User is Joined
   const { io } = require('../app');
   io.sockets.emit('userJoined', {
      socketId: req.body.socketId,
      userName,
      room: updatedRoom,
   });

   return;
});

exports.addNewRoom = CatchAsync(async (req, res, next) => {
   const { name, key, locked } = req.body;

   if (!name) {
      return res.json({
         staus: 'failed',
         messsage: 'plz Enter Room Name',
      });
   }

   let newRoom;
   if (key) {
      newRoom = await Room.create({
         name: name.toLowerCase().trim(),
         key: key.toLowerCase().trim(),
         locked: true,
      });
   } else {
      newRoom = await Room.create({
         name: name.toLowerCase().trim(),
      });
   }

   res.status(200).json({
      success: 'true',
      message: 'room Added',
      room: newRoom,
   });
});

exports.deleteRoom = CatchAsync(async (req, res, next) => {
   const { name, key } = req.body;

   const deleteRoom = await Room.findOneAndDelete({
      name: name,
      key: key,
   });

   res.status(200).json({
      success: 'true',
      message: 'room Addded',
      room: newRoom,
   });
});

exports.deleteRoomUser = CatchAsync(async (req, res, next) => {
   const { roomName } = req.params;
   const { currentUser } = req.body;

   let room = await Room.findOne({
      name: roomName,
   });

   // console.log('room', room.users.length);

   if (!room) {
      return res.status(494).json({
         success: 'No Room with that name',
      });
   }

   // console.log(
   //    'room.users.map((user) => user.name !== currentUser)',
   const removedUser =
      room.users[
         room.users.findIndex(
            (el) =>
               el.name.toLowerCase().trim() === currentUser.toLowerCase().trim()
         )
      ];

   room.users = room.users.filter(
      (user) =>
         user.name.toLowerCase().trim() !== currentUser.toLowerCase().trim()
   );

   const updatedRoom = await room.save({ validateBeforeSave: false });

   res.status(200).json({
      success: 'success',
      rooms: updatedRoom,
   });

   // * Send Event to Client that User is Removed
   const { io } = require('../app');
   io.sockets.emit('userLeft', {
      socketId: req.body.socketId,
      user: removedUser,
      room: updatedRoom,
   });

   return;
   // console.log('updatedRoom', updatedRoom.users.length);
});

exports.addNewMessage = CatchAsync(async (req, res, next) => {
   const { roomName, socketId, newMessage } = req.body;

   // Find room where message is to be Added
   let room = await Room.findOne({
      name: roomName,
   });

   if (!room) {
      return res.status(404).json({
         status: 'failed',
         messsage: 'No Room with that name to add new message',
      });
   }

   room.messages = room.messages.push(newMessage);

   res.status(200).json({
      status: 'success',
      room,
      newMessage,
   });

   // * Send Event to Client that New Message is Added
   const { io } = require('../app');
   io.sockets.emit('newMessage', {
      socketId: req.body.socketId,
      newMessage,
      room,
   });
});
