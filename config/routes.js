"use stric";

const express = require('express');
const router  = express.Router();

// Home page route.
router.get('/', (req, res) => {
  res.render('index');
});

// About page route.
router.get('/about', (req, res) => {

});

// Contact page route.
router.get('/contact', (req, res) => {

});

module.exports = router;
