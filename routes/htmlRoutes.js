const express = require('express');
const path = require('path');
const router = require('express').Router();

// Route to home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route to notes page
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

router.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
  });
  
  // Catch-all route that redirects to home page for 404 errors
  router.use((err, req, res, next) => {
    if (err.status === 404) {
      res.redirect('/');
    } else {
      next(err);
    }
  });
  
  module.exports = router;
  

