const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env and DB
dotenv.config();
require('./config/db');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');


const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions & Passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/', authRouter);

// Error handlers
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message });
});

module.exports = app;