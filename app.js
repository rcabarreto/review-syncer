const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const schedule = require('node-schedule');

const db = require('./db');

const reviewSync = require('./lib/reviewSync')(db);

const indexRouter = require('./routes/index')(db);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


const executionInterval = 30;

let j = schedule.scheduleJob(`*/${executionInterval} * * * *`, function(){
  reviewSync.loadAllReviews();
});

reviewSync.loadAllReviews();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// sync the database
db.sequelize.sync({force:true}).then(() => {
  // {force:true}
});


module.exports = app;
