'use strict';

module.exports = (sequelize, DataTypes) => {
  const appReview = sequelize.define('shopify_app_reviews', {
    shopify_domain: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    app_slug: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    star_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  return appReview;
};