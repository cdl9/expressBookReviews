const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  console.log(users);
  if (!username || !password) {
    res.status(400).send("Username or password not found");
  }
  else if (!isValid(username)) {
    res.status(400).send("Username already exists");
  }
  else {
    users.push({ username, password });
    res.status(200).send("Username has been registered");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let result = [];

  Object.keys(books).forEach(function(isbn) {
    if (books[isbn].author == author)
      result.push(books[isbn]);
  });

  res.send(result);
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let result = [];

    let keys = Object.keys(books);

    keys.forEach(function(isbn) {
      if (books[isbn].title == title)
        result.push(books[isbn]);
    });

    res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    let isbnP = req.params.isbn;
    let result = [];

    let keys = Object.keys(books);

    keys.forEach(function(isbn) {
      if (isbn == isbnP)
        result.push(books[isbn].review);
    });

    res.send(result);
});


/////////
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get(
      `http://localhost:5000/title/${title}`
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports.general = public_users;
