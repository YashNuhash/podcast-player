const axios = require('axios');

// Function to get access token from Auth0
async function getAccessToken() {
  try {
    const response = await axios.post('https://nexcast.us.auth0.com/oauth/token', {
      client_id: "rChnCWCsPEbFOYwhgHQlO1JmwJLRUhNv",  // from environment variable
      client_secret:"3vD0uF9SYMO86QGeCUXsZbfoxaYhkyai6v3uFq9rBmre1L4VnhCON7I8smV8l7dU",  // from environment variable
      audience: 'http://localhost:3000/auth/callback',  // replace with your actual API identifier
      grant_type: 'client_credentials'
    });

    console.log(response.data);  // This will log the token to your console
  } catch (error) {
    console.error('Error fetching the token:', error);
  }
}

module.exports = { getAccessToken };
