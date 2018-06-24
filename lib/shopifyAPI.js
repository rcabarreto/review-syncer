'use strict';

const request = require('request');

const SHOPIFY_API_URL = 'https://apps.shopify.com';

module.exports = {

  fetchReviews(appSlug) {

    return new Promise((resolve, reject) => {

      request({
        url: `${SHOPIFY_API_URL}/${appSlug}/reviews.json`,
        json: true
      }, (error, response, body) => {

        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error('Unable to fetch information from Shopify API!'));
        }

      });
    });
  }
};
