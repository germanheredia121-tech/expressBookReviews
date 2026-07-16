const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

async function getBooksData() {
  try {
    await axios.get("https://jsonplaceholder.typicode.com/posts");
    return books;
  } catch (error) {
    return books;
  }
}

public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  const data = await getBooksData();
  return res.status(200).json(data);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const data = await getBooksData();
  const book = data[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  const data = await getBooksData();
  const results = [];

  for (const [isbn, book] of Object.entries(data)) {
    if (book.author && book.author.toLowerCase() === author.toLowerCase()) {
      results.push({
        isbn,
        title: book.title,
        author: book.author,
        reviews: book.reviews
      });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  const data = await getBooksData();
  const results = [];

  for (const [isbn, book] of Object.entries(data)) {
    if (book.title && book.title.toLowerCase() === title.toLowerCase()) {
      results.push({
        isbn,
        title: book.title,
        author: book.author,
        reviews: book.reviews
      });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.status(404).json({ message: "No books found with this title" });
});

// Get book review
public_users.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const data = await getBooksData();
  const book = data[isbn];

  if (book) {
    return res.status(200).json({ isbn: isbn, reviews: book.reviews || {} });
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;