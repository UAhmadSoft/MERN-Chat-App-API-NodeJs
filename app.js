const dotenv = require('dotenv');
dotenv.config({
   path: './config.env',
});

var express = require('express');
var logger = require('morgan');
const path = require('path');
const cors = require('cors');

var indexRouter = require('./routes/index');
var roomsRouter = require('./routes/roomsRouter');
const errorController = require('./Controllers/errorController');
const AppError = require('./Utils/AppError');
const DBConnect = require('./Utils/DBConnect');
const server = require('./server');
const socketIo = require('socket.io');

var app = express();

// Connect DB
DBConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', indexRouter);
app.use('/rooms', roomsRouter);

// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this Server`, 404));
});

// error handler
app.use(errorController);

server.appListen(app);
const socketServer = server.getServer();

const io = socketIo(socketServer);

io.on('connection', (socket) => {
   console.log(`Hurrah Socket ${socket.id} Connected`);
});

module.exports = { io };
