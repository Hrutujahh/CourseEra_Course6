const express = require("express");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// User registration
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body; // Accept username from the request body

  const book = books[isbn]; // Access the book by ISBN
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user already has a review for this book
  const existingReview = book.reviews[username];

  if (existingReview) {
    // Modify existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully." });
  } else {
    // Add new review
    book.reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const { isbn } = req.params;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Remove all reviews associated with the book
  book.reviews = {}; // This will delete all reviews for the book
  return res.status(200).json({ message: "All reviews deleted successfully." });
});

// Get reviews for a book
regd_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    res.json(book.reviews || {}); // Return reviews, or an empty object if none exist
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
