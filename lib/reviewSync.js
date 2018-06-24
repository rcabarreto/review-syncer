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

      console.log('call to loadAllReviews');

      db.app.findAll().then(appList => {

        if (appList.length > 0) {
          console.log('get apps');
          let filteredAppList = appList.map(app => this.fetchAppReview(app));

        } else {
          let appNames = [
            'product-upsell',
            'product-discount',
            'store-locator',
            'product-options',
            'quantity-breaks',
            'product-bundles',
            'customer-pricing',
            'product-builder',
            'social-triggers',
            'recurring-orders',
            'multi-currency',
            'quickbooks-online',
            'xero',
            'the-bold-brain'
          ];

          appNames.map((appName) => {
            db.app.upsert({ app_slug: appName }).then(app => {
              console.log('Insert success!', JSON.stringify(app))
            });
          });

        }

      })
    }


  };
};