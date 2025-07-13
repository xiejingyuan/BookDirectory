const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Middleware: check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// List all books (GET /books)
router.get('/', isLoggedIn, async (req, res) => {
  const books = await Book.find();
  res.render('books/list', { books });
});

// Add book form (GET /books/add)
router.get('/add', isLoggedIn, (req, res) => {
  res.render('books/add');
});

// Add book handler (POST /books/add)
router.post('/add', isLoggedIn, async (req, res) => {
  await Book.create(req.body);
  res.redirect('/books');
});

// Edit form (GET /books/edit/:id)
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('books/edit', { book });
});

// Edit handler (POST /books/edit/:id)
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/books');
});

// Delete handler (GET /books/delete/:id)
router.get('/delete/:id', isLoggedIn, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/books');
});

module.exports = router;