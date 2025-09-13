const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

    
    //return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {

    try {
    
	const getBooks_promise = new Promise((resolve,reject) => {
	    res.send(JSON.stringify(books, 4, null));
	});
	getBooks_promise.then(console.log("Promise getBooks_promise resolved"));
    } catch {
	getBooks_promise.catch(console.log("Problem during promise. Could not get books."));
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const book_by_isbn_promise = new Promise((resolve,reject) => {
	const isbn = req.params.isbn;
	res.send(JSON.stringify(books[isbn]));
    });
    try {
	book_by_isbn_promise.then(console.log("Book by isbn get delivered"));
    } catch {
	book_by_isbn_promise.catch(console.log("Problem occurred in GET Book by isbn ."));
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    books_by_author_promise = new Promise((resolve,reject) => {	
	const author = req.params.author;
	const booksArray = Object.entries(books).map(([isbn, book]) => ({
            isbn: Number(isbn),
            ...book
	}));
	const books_author = booksArray.filter((book) => book.author == author);
	res.send(JSON.stringify(books_author));
    });

    try {
	books_by_author_promise.then(console.log("GET books by author delivered."));
    } catch {
	books_by_author_promise.then(console.log("Problem: GET books by author: not delivered."));
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const book_by_title_promise = new Promise((resolve,reject) => {

	const title = req.params.title;
	const booksArray = Object.entries(books).map(([isbn, book]) => ({
            isbn: Number(isbn),
            ...book
	}));

	const books_title = booksArray.filter((book) => book.title == title);
	
	res.send(JSON.stringify(books_title));
    });

    try {
	book_by_title_promise.then(console.log("GET book by title delivered"));
    } catch {
	book_by_title_promise.catch(console.log("Problem occurred: GET book by title not delivered"));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].review));
    //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
