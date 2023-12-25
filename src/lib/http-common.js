const axios = require("axios");

exports.instance = axios.create({
  baseURL: 'https://stoplight.io/mocks/insignia/insignia-offline-assignment-test/29435530', // should be dynamic
  // timeout: 1000,
  headers: {
    "Content-type": "application/json"
  }
});