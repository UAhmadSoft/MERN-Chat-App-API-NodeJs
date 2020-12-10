const express = require('express');
const bodyParser = require('body-parser');

const roomController = require('../Controllers/roomController');

const urlEncodedParser = bodyParser.urlencoded({
   extended: true,
});

const router = express.Router();

router
   .route('/')
   .get(roomController.getAllRooms)
   .post(urlEncodedParser, roomController.addNewRoom);

router.get('/:userName/:roomName/:key', roomController.getRoom);
router.get('/:userName/roomName', roomController.getRoom);

router.put('/:roomName', urlEncodedParser, roomController.deleteRoomUser);

router.delete('/:name', roomController.deleteRoom);
router.delete('/:name/:key', roomController.deleteRoom);

router.post('/message', urlEncodedParser, roomController.addNewMessage);

module.exports = router;
