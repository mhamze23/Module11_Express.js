// Importing required dependencies
const express = require('express');
const path = require('path');

// Creating an instance of Router middleware
const router = require('express').Router();

// Defining a GET request handler for the '/' route (i.e. home page)
router.get('/', (req, res) => {
  // Responding to the GET request with the contents of 'index.html' file
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Defining a GET request handler for the '/notes' route
router.get('/notes', (req, res) => {
  // Responding to the GET request with the contents of 'notes.html' file
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// Defining a GET request handler for any route not explicitly defined above
router.get('*', (req, res) => {
  // Responding to the GET request with the contents of 'index.html' file
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Exporting the router instance to be used in other modules
module.exports = router;
