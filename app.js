const createError = require('http-errors');
const express = require('express');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const walletRouter = require('./routes/wallet');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
}));

app.use('/', walletRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
