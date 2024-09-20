const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the user already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  try {
    // Using JSON.stringify to format the books neatly
    res.send(JSON.stringify(books, null, 2)); // 2 spaces for indentation
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params; // Extract the ISBN from the request parameters
  const book = books[isbn]; // Access the book using the ISBN as a key

  if (book) {
    res.json(book); // Return the book details
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where the book does not exist
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params; // Extract the author from the request parameters
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  ); // Filter books by author

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); // Return the filtered books
  } else {
    res.status(404).json({ message: "No books found by this author" }); // Handle case where no books are found
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params; // Extract the title from the request parameters
  const filteredBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  ); // Filter books by title

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); // Return the filtered books
  } else {
    res.status(404).json({ message: "No books found with this title" }); // Handle case where no books are found
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params; // Extract the ISBN from the request parameters
  const book = books[isbn]; // Access the book by ISBN

  if (book) {
    // Check if the book has reviews
    if (Object.keys(book.reviews).length > 0) {
      res.json(book.reviews); // Return the reviews
    } else {
      res.status(404).json({ message: "No reviews found for this book" }); // Handle case where no reviews exist
    }
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where book does not exist
  }
});

public_users.get("/", async (req, res) => {
  res.json(books);
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", async (req, res) => {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
