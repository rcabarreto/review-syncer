'use strict';
const shopifyAPI = require('./shopifyAPI');

module.exports = (db) => {
  return {


    fetchAppReview: function (app) {
      shopifyAPI.fetchReviews(app.app_slug).then(appReviews => {
        let overallRating = appReviews.overall_rating;
        let reviews = appReviews.reviews;

        reviews.map(review => {
          db.appReview.find({ where:{ shopify_domain: review.shop_domain, createdAt: review.created_at }}).then(dbReview => {
            if (dbReview) {
              console.log('found review! skipping!');
            } else {
              console.log('have to create review!');
              db.appReview.create({ shopify_domain: review.shop_domain, app_slug: app.app_slug, star_rating: review.star_rating, createdAt: review.created_at });
            }
          }, err => {
            console.log('error');
          })
        });

        return app.update({ overall_rating: overallRating });

      }).then(app => {
        console.log('App updated successfully!');
      }).catch(err => {
        console.log('There was an error');
      });
    },

    loadAppReview: function (appSlug) {
      db.app.find({ app_slug: appSlug }).then(app => this.fetchAppReview(app));
    },

    loadAllReviews: function () {
      db.app.findAll().then(appList => {
        let filteredAppList = appList.map(app => this.fetchAppReview(app));
      })
    }


  };
};