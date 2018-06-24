'use strict';

module.exports = (sequelize, DataTypes) => {

  const app = sequelize.define('shopify_app', {
    app_slug: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    overall_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  return app;

};