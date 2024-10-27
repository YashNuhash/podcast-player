const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const cors = require('cors');
const request = require('request');
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const app = express(); // Initialize app

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React frontend
}));

// Correct audience value; it should match your API identifier
const checkJwt = auth({
  audience: 'http://localhost:3000/auth/callback', // Change to your API identifier
  issuerBaseURL: 'https://nexcast.us.auth0.com',
  tokenSigningAlg: 'RS256' // Ensure this matches the signing algorithm
});
app.use(checkJwt);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

// Route to handle the /auth/callback POST request
app.post('/auth/callback', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract the token
    
    // Verify the token using jwksRsa
    jwt.verify(token, jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://nexcast.us.auth0.com/.well-known/jwks.json',
    }), { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: 'Token verification failed' });
      }
      console.log('Token verified:', decoded);
      res.status(200).send({ message: 'Token is valid', user: decoded });
    });
  } else {
    res.status(401).send({ message: 'Authorization header missing' });
  }
});

// Endpoint to verify token with middleware
app.post('/verify-token', checkJwt, (req, res) => {
  console.log('Received Token from backend:', req.headers.authorization);
  console.log('Token verified from backend, request received:', req.auth); // req.auth contains decoded token info
  res.send({ message: 'Token is valid from backend, user is authorized!' });
});

// Route to request a new token
app.get('/request-token', (req, res) => {
  getToken();
  res.send('Token requested');
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// Optionally, request a new token (for testing purposes)
const getToken = () => {
  const options = {
    method: 'POST',
    url: 'https://nexcast.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: 'rChnCWCsPEbFOYwhgHQlO1JmwJLRUhNv',
      client_secret: '3vD0uF9SYMO86QGeCUXsZbfoxaYhkyai6v3uFq9rBmre1L4VnhCON7I8smV8l7dU',
      audience: 'http://localhost:3000/auth/callback',
      grant_type: 'client_credentials'
    })
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const data = JSON.parse(body);
    console.log(data); // Check the structure of the returned token
  });
};