const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Placeholder API URL.
// In a real project, replace this with your real backend/API endpoint.
const BOOKS_API_URL = "https://jsonplaceholder.typicode.com/posts";

async function getBooksData() {
  try {
    const response = await axios.get(BOOKS_API_URL);
    return response.data;
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
  try {
    const data = await getBooksData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const data = await getBooksData();
    const book = data[isbn] || data.find((item) => item.isbn === isbn);

    if (book) {
      return res.status(200).json(book);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const data = await getBooksData();
    const list = Array.isArray(data) ? data : Object.values(data);
    const results = [];

    for (const item of list) {
      if (item.author && item.author.toLowerCase() === author.toLowerCase()) {
        results.push({
          isbn: item.isbn || item.id,
          title: item.title,
          author: item.author,
          reviews: item.reviews
        });
      }
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(404).json({ message: "No books found for this author" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const data = await getBooksData();
    const list = Array.isArray(data) ? data : Object.values(data);
    const results = [];

    for (const item of list) {
      if (item.title && item.title.toLowerCase() === title.toLowerCase()) {
        results.push({
          isbn: item.isbn || item.id,
          title: item.title,
          author: item.author,
          reviews: item.reviews
        });
      }
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const data = await getBooksData();
    const book = data[isbn] || data.find((item) => item.isbn === isbn);

    if (book) {
      return res.status(200).json({ isbn: isbn, reviews: book.reviews });
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});

module.exports.general = public_users;