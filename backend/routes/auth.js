const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db/connection');

const router = express.Router();

router.post('/callback', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = jwt.decode(token);
    const email = decoded.email;

    if (email) {
      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send('Database error');

        if (results.length === 0) {
          connection.query('INSERT INTO users (email) VALUES (?)', [email], (err) => {
            if (err) return res.status(500).send('Failed to insert user');
            res.send('User added successfully');
          });
        } else {
          res.send('User already exists');
        }
      });
    } else {
      res.status(400).send('Invalid email');
    }
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
});

module.exports = router;
