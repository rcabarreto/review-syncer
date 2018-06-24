const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const schedule = require('node-schedule');

const db = require('./db');

const reviewSync = require('./lib/reviewSync')(db);

const indexRouter = require('./routes/index');

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





let executionInterval = 1;

let j = schedule.scheduleJob(`*/${executionInterval} * * * *`, function(){
  console.log('The answer to life, the universe, and everything!');

});

reviewSync.loadAppReview('product-upsell');



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
db.sequelize.sync().then(() => {
  // {force:true}

  // let appNames = [
  //   'product-upsell',
  //   'product-discount',
  //   'store-locator',
  //   'product-options',
  //   'quantity-breaks',
  //   'product-bundles',
  //   'customer-pricing',
  //   'product-builder',
  //   'social-triggers',
  //   'recurring-orders',
  //   'multi-currency',
  //   'quickbooks-online',
  //   'xero',
  //   'the-bold-brain'
  // ];
  //
  // appNames.map((appName) => {
  //   db.app.upsert({ app_slug: appName }).then(app => {
  //     console.log('Insert success!', JSON.stringify(app))
  //   });
  // });

});


module.exports = app;
