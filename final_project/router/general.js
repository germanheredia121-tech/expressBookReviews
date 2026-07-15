const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password ){
    return res.status(400).json({ message : "Username and password are required"});
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists){
    return res.status(400).json({ message : "User already exists"});
  }

  users.push({ username, password});
  return res.status(201).json({ message : "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.type('json').send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;
  const results = [];
  for (let isbn in books){
    if (books[isbn].author.toLowerCase() === author.toLowerCase()){
      results.push({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author, 
        reviews: books[isbn].reviews
      })
    }
  }
  if (results.length > 0){
    return res.status(200).json(results);
  }
  return res.status(404).json({ message : "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const results = [];

  for (let isbn in books){
    if (books[isbn].title.toLowerCase() === title.toLocaleLowerCase()){
      results.push({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      })
    }
  }
  if (results.length > 0){
    return res.status(200).json(results);
  }
  return res.status(404).json({ message : "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (books){
    return res.status(200).json({isbn: isbn, reviews: book.reviews})
  }
  return res.status(404).json({ message : "Book not found"})
});

module.exports.general = public_users;
